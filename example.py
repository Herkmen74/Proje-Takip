#!/usr/bin/env python3
"""
Basit kullanım örneği
"""

from youtube_subtitle_translator import YouTubeSubtitleTranslator

def main():
    url = input("YouTube video URL'sini girin: ")
    
    translator = YouTubeSubtitleTranslator(output_dir="output")
    
    print("\n🎬 Video işleniyor...\n")
    
    success = translator.process(
        url=url,
        embed=True,
        separate=True
    )
    
    if success:
        print("\n✅ Başarılı! output/ klasörünü kontrol edin.")
    else:
        print("\n❌ İşlem başarısız oldu.")

if __name__ == "__main__":
    main()
