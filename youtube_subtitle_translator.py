#!/usr/bin/env python3
"""
YouTube Subtitle Translator
İngilizce YouTube videolarına Türkçe alt yazı ekler
"""

import os
import sys
import argparse
from pathlib import Path
import yt_dlp
from deep_translator import GoogleTranslator
import pysrt
import subprocess


class YouTubeSubtitleTranslator:
    def __init__(self, output_dir="output"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.translator = GoogleTranslator(source='en', target='tr')
        
    def download_video_and_subtitles(self, url):
        """YouTube videosunu ve İngilizce alt yazılarını indirir"""
        print(f"📥 Video indiriliyor: {url}")
        
        video_path = self.output_dir / "video.mp4"
        subtitle_path = self.output_dir / "subtitles.en.srt"
        
        ydl_opts = {
            'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            'outtmpl': str(video_path.with_suffix('')),
            'writesubtitles': True,
            'writeautomaticsub': True,
            'subtitleslangs': ['en'],
            'subtitlesformat': 'srt',
            'merge_output_format': 'mp4',
        }
        
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                video_title = info.get('title', 'video')
                
            if not video_path.exists():
                raise FileNotFoundError("Video indirilemedi!")
                
            en_subtitle_files = list(self.output_dir.glob("*.en.srt")) + \
                               list(self.output_dir.glob("*.en.*.srt"))
            
            if not en_subtitle_files:
                print("⚠️  İngilizce alt yazı bulunamadı. Manuel olarak eklenmelidir.")
                return str(video_path), None, video_title
            
            subtitle_file = en_subtitle_files[0]
            subtitle_file.rename(subtitle_path)
            
            print(f"✅ Video indirildi: {video_path}")
            print(f"✅ Alt yazı indirildi: {subtitle_path}")
            
            return str(video_path), str(subtitle_path), video_title
            
        except Exception as e:
            print(f"❌ Hata: {e}")
            return None, None, None
    
    def translate_subtitles(self, subtitle_path):
        """SRT alt yazı dosyasını İngilizceden Türkçeye çevirir"""
        if not subtitle_path or not os.path.exists(subtitle_path):
            print("❌ Alt yazı dosyası bulunamadı!")
            return None
            
        print(f"🔄 Alt yazılar çevriliyor...")
        
        try:
            subs = pysrt.open(subtitle_path, encoding='utf-8')
            total = len(subs)
            
            for i, sub in enumerate(subs, 1):
                if i % 10 == 0:
                    print(f"   İlerleme: {i}/{total} ({int(i/total*100)}%)")
                
                try:
                    if sub.text.strip():
                        sub.text = self.translator.translate(sub.text)
                except Exception as e:
                    print(f"⚠️  Çeviri hatası (satır {i}): {e}")
                    continue
            
            turkish_subtitle_path = subtitle_path.replace('.en.', '.tr.')
            if turkish_subtitle_path == subtitle_path:
                turkish_subtitle_path = subtitle_path.replace('.srt', '.tr.srt')
            
            subs.save(turkish_subtitle_path, encoding='utf-8')
            print(f"✅ Türkçe alt yazı oluşturuldu: {turkish_subtitle_path}")
            
            return turkish_subtitle_path
            
        except Exception as e:
            print(f"❌ Alt yazı çevirisi sırasında hata: {e}")
            return None
    
    def add_subtitles_to_video(self, video_path, subtitle_path, output_name=None):
        """Türkçe alt yazıları videoya ekler (hardcoded)"""
        if not video_path or not subtitle_path:
            print("❌ Video veya alt yazı dosyası eksik!")
            return None
            
        if not output_name:
            output_name = "video_with_turkish_subtitles.mp4"
        
        output_path = self.output_dir / output_name
        
        print(f"🎬 Alt yazılar videoya ekleniyor...")
        
        subtitle_path_abs = os.path.abspath(subtitle_path)
        subtitle_path_escaped = subtitle_path_abs.replace('\\', '/').replace(':', '\\:')
        
        cmd = [
            'ffmpeg',
            '-i', video_path,
            '-vf', f"subtitles={subtitle_path_escaped}",
            '-c:a', 'copy',
            '-y',
            str(output_path)
        ]
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"✅ Türkçe alt yazılı video oluşturuldu: {output_path}")
                return str(output_path)
            else:
                print(f"❌ FFmpeg hatası: {result.stderr}")
                return None
                
        except FileNotFoundError:
            print("❌ FFmpeg bulunamadı! Lütfen FFmpeg'i yükleyin.")
            print("   Ubuntu/Debian: sudo apt-get install ffmpeg")
            print("   macOS: brew install ffmpeg")
            print("   Windows: https://ffmpeg.org/download.html")
            return None
        except Exception as e:
            print(f"❌ Video işleme hatası: {e}")
            return None
    
    def create_separate_subtitle_file(self, subtitle_path, output_name=None):
        """Türkçe alt yazı dosyasını ayrı bir dosya olarak kaydeder"""
        if not output_name:
            output_name = "turkish_subtitles.srt"
        
        final_path = self.output_dir / output_name
        
        if subtitle_path != str(final_path):
            import shutil
            shutil.copy(subtitle_path, final_path)
            print(f"💾 Türkçe alt yazı dosyası: {final_path}")
        
        return str(final_path)
    
    def process(self, url, embed=True, separate=True):
        """YouTube videosunu işler: indir, çevir, alt yazı ekle"""
        print("=" * 60)
        print("YouTube Subtitle Translator - İngilizce → Türkçe")
        print("=" * 60)
        
        video_path, subtitle_path, video_title = self.download_video_and_subtitles(url)
        
        if not video_path:
            return False
        
        if not subtitle_path:
            print("\n⚠️  Alt yazı bulunamadı!")
            print("Video indirildi ama alt yazı yok.")
            return False
        
        turkish_subtitle_path = self.translate_subtitles(subtitle_path)
        
        if not turkish_subtitle_path:
            return False
        
        results = []
        
        if separate:
            safe_title = "".join(c for c in video_title if c.isalnum() or c in (' ', '-', '_')).strip()
            subtitle_name = f"{safe_title}_turkish.srt" if safe_title else "turkish_subtitles.srt"
            result = self.create_separate_subtitle_file(turkish_subtitle_path, subtitle_name)
            if result:
                results.append(result)
        
        if embed:
            safe_title = "".join(c for c in video_title if c.isalnum() or c in (' ', '-', '_')).strip()
            output_name = f"{safe_title}_TR.mp4" if safe_title else "video_with_turkish_subtitles.mp4"
            result = self.add_subtitles_to_video(video_path, turkish_subtitle_path, output_name)
            if result:
                results.append(result)
        
        print("\n" + "=" * 60)
        print("✨ İşlem Tamamlandı!")
        print("=" * 60)
        
        if results:
            print("\n📂 Oluşturulan Dosyalar:")
            for result in results:
                print(f"   • {result}")
        
        return True


def main():
    parser = argparse.ArgumentParser(
        description='YouTube videolarına İngilizce alt yazıları Türkçeye çevirerek ekler',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Örnekler:
  %(prog)s "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  %(prog)s "https://youtu.be/dQw4w9WgXcQ" --no-embed
  %(prog)s "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --no-separate
        """
    )
    
    parser.add_argument('url', help='YouTube video URL')
    parser.add_argument('--output-dir', '-o', default='output',
                       help='Çıktı dizini (varsayılan: output)')
    parser.add_argument('--no-embed', action='store_true',
                       help='Alt yazıları videoya gömmez (sadece .srt dosyası oluşturur)')
    parser.add_argument('--no-separate', action='store_true',
                       help='Ayrı .srt dosyası oluşturmaz')
    
    args = parser.parse_args()
    
    if args.no_embed and args.no_separate:
        print("❌ Hata: En az bir çıktı formatı seçilmeli (--no-embed veya --no-separate)")
        sys.exit(1)
    
    translator = YouTubeSubtitleTranslator(output_dir=args.output_dir)
    
    success = translator.process(
        args.url,
        embed=not args.no_embed,
        separate=not args.no_separate
    )
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
