#!/usr/bin/env python3
"""
YouTube Subtitle Translator - Web Application
Flask tabanlı web arayüzü
"""

from flask import Flask, render_template, request, jsonify, send_file, session
from werkzeug.utils import secure_filename
import os
import threading
import time
import uuid
from pathlib import Path
import shutil
from youtube_subtitle_translator import YouTubeSubtitleTranslator

app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB max

# Global dictionary to track job status
jobs = {}

class TranslationJob:
    def __init__(self, job_id, url):
        self.job_id = job_id
        self.url = url
        self.status = 'waiting'  # waiting, downloading, translating, embedding, completed, error
        self.progress = 0
        self.message = 'İşlem başlatılıyor...'
        self.video_file = None
        self.subtitle_file = None
        self.error = None
        self.output_dir = Path('output') / job_id
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
    def update(self, status, progress, message):
        self.status = status
        self.progress = progress
        self.message = message
        
    def to_dict(self):
        return {
            'job_id': self.job_id,
            'status': self.status,
            'progress': self.progress,
            'message': self.message,
            'video_file': self.video_file,
            'subtitle_file': self.subtitle_file,
            'error': self.error
        }

def process_video(job_id, url):
    """Background thread to process video"""
    job = jobs[job_id]
    
    try:
        job.update('downloading', 10, '📥 Video ve alt yazılar indiriliyor...')
        
        translator = YouTubeSubtitleTranslator(output_dir=str(job.output_dir))
        
        # Download video and subtitles
        video_path, subtitle_path, video_title = translator.download_video_and_subtitles(url)
        
        if not video_path:
            job.status = 'error'
            job.error = 'Video indirilemedi!'
            return
            
        if not subtitle_path:
            job.status = 'error'
            job.error = 'İngilizce alt yazı bulunamadı!'
            return
        
        job.update('translating', 40, '🔄 Alt yazılar Türkçeye çevriliyor...')
        
        # Translate subtitles
        turkish_subtitle_path = translator.translate_subtitles(subtitle_path)
        
        if not turkish_subtitle_path:
            job.status = 'error'
            job.error = 'Alt yazı çevirisi başarısız!'
            return
        
        job.update('embedding', 70, '🎬 Alt yazılar videoya ekleniyor...')
        
        # Add subtitles to video
        safe_title = "".join(c for c in video_title if c.isalnum() or c in (' ', '-', '_')).strip()
        output_name = f"{safe_title}_TR.mp4" if safe_title else "video_with_turkish_subtitles.mp4"
        subtitle_name = f"{safe_title}_turkish.srt" if safe_title else "turkish_subtitles.srt"
        
        final_video = translator.add_subtitles_to_video(video_path, turkish_subtitle_path, output_name)
        final_subtitle = translator.create_separate_subtitle_file(turkish_subtitle_path, subtitle_name)
        
        if not final_video:
            job.status = 'error'
            job.error = 'Alt yazılar videoya eklenemedi!'
            return
        
        job.video_file = os.path.basename(final_video)
        job.subtitle_file = os.path.basename(final_subtitle)
        job.update('completed', 100, '✅ İşlem tamamlandı!')
        
    except Exception as e:
        job.status = 'error'
        job.error = f'Hata: {str(e)}'
        job.progress = 0

@app.route('/')
def index():
    """Ana sayfa"""
    return render_template('index.html')

@app.route('/api/process', methods=['POST'])
def process():
    """Video işleme isteği"""
    data = request.get_json()
    url = data.get('url', '').strip()
    
    if not url:
        return jsonify({'error': 'YouTube URL gerekli!'}), 400
    
    if 'youtube.com' not in url and 'youtu.be' not in url:
        return jsonify({'error': 'Geçerli bir YouTube URL giriniz!'}), 400
    
    # Create new job
    job_id = str(uuid.uuid4())
    job = TranslationJob(job_id, url)
    jobs[job_id] = job
    
    # Start background thread
    thread = threading.Thread(target=process_video, args=(job_id, url))
    thread.daemon = True
    thread.start()
    
    return jsonify({'job_id': job_id})

@app.route('/api/status/<job_id>')
def status(job_id):
    """İşlem durumunu kontrol et"""
    job = jobs.get(job_id)
    
    if not job:
        return jsonify({'error': 'İşlem bulunamadı!'}), 404
    
    return jsonify(job.to_dict())

@app.route('/api/download/<job_id>/<file_type>')
def download(job_id, file_type):
    """Dosya indirme"""
    job = jobs.get(job_id)
    
    if not job:
        return jsonify({'error': 'İşlem bulunamadı!'}), 404
    
    if file_type == 'video' and job.video_file:
        file_path = job.output_dir / job.video_file
        if file_path.exists():
            return send_file(file_path, as_attachment=True, download_name=job.video_file)
    
    elif file_type == 'subtitle' and job.subtitle_file:
        file_path = job.output_dir / job.subtitle_file
        if file_path.exists():
            return send_file(file_path, as_attachment=True, download_name=job.subtitle_file)
    
    return jsonify({'error': 'Dosya bulunamadı!'}), 404

@app.route('/api/cleanup/<job_id>', methods=['POST'])
def cleanup(job_id):
    """İşlem dosyalarını temizle"""
    job = jobs.get(job_id)
    
    if not job:
        return jsonify({'error': 'İşlem bulunamadı!'}), 404
    
    try:
        if job.output_dir.exists():
            shutil.rmtree(job.output_dir)
        del jobs[job_id]
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'jobs': len(jobs)})

def _find_free_port(start=5000, limit=20):
    """Find an available TCP port starting from `start`."""
    import socket
    for port in range(start, start + limit):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                sock.bind(('0.0.0.0', port))
                return port
            except OSError:
                continue
    return start


if __name__ == '__main__':
    # Create output directory
    Path('output').mkdir(exist_ok=True)

    port = int(os.environ.get('PORT', _find_free_port(5000)))

    print("=" * 60)
    print("YouTube Subtitle Translator - Web Arayuzu")
    print("=" * 60)
    print()
    print("Sunucu baslatiliyor...")
    print()
    print("NOT: Bu Cursor Cloud ise telefonda localhost CALISMAZ.")
    print("     Programi kendi bilgisayarinizda calistirin.")
    print("     Detay: ONEMLI_OKU.md")
    print()
    print(f"Ayni makinede tarayici:  http://127.0.0.1:{port}")
    print()
    print("Kendi PC'nizde iPhone icin:")
    print("  1. Bilgisayar ve telefon AYNI WiFi'de olsun")
    print("  2. IP ogrenin (Windows: ipconfig / Mac: ifconfig)")
    print(f"  3. Safari: http://BILGISAYAR_IP:{port}")
    print()
    print("Durdurmak icin: Ctrl+C")
    print("=" * 60)
    print()

    # Run on all interfaces so it's accessible from network
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)
