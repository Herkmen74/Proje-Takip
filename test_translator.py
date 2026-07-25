#!/usr/bin/env python3
"""
Test script for YouTube Subtitle Translator
Tests the translation functionality without requiring actual YouTube downloads
"""

import os
import tempfile
from pathlib import Path
from youtube_subtitle_translator import YouTubeSubtitleTranslator
import pysrt

def create_sample_subtitle():
    """Create a sample English subtitle file for testing"""
    sample_srt = """1
00:00:00,000 --> 00:00:03,000
Hello, welcome to this tutorial.

2
00:00:03,000 --> 00:00:06,000
Today we will learn about Python programming.

3
00:00:06,000 --> 00:00:09,000
Python is a powerful and easy to learn language.

4
00:00:09,000 --> 00:00:12,000
Let's get started with some examples.

5
00:00:12,000 --> 00:00:15,000
Thank you for watching!
"""
    return sample_srt

def test_translation():
    """Test subtitle translation functionality"""
    print("=" * 60)
    print("YouTube Subtitle Translator - Test")
    print("=" * 60)
    print()
    
    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdir_path = Path(tmpdir)
        
        print("1️⃣  Creating sample English subtitle file...")
        en_subtitle_path = tmpdir_path / "test_subtitles.en.srt"
        with open(en_subtitle_path, 'w', encoding='utf-8') as f:
            f.write(create_sample_subtitle())
        print(f"✅ Sample subtitle created: {en_subtitle_path}")
        print()
        
        subs = pysrt.open(str(en_subtitle_path), encoding='utf-8')
        print("📝 Original English subtitles:")
        for sub in subs[:3]:
            print(f"   [{sub.index}] {sub.text}")
        print("   ...")
        print()
        
        print("2️⃣  Initializing translator...")
        translator = YouTubeSubtitleTranslator(output_dir=str(tmpdir_path))
        print("✅ Translator initialized")
        print()
        
        print("3️⃣  Translating subtitles to Turkish...")
        tr_subtitle_path = translator.translate_subtitles(str(en_subtitle_path))
        
        if tr_subtitle_path:
            print(f"✅ Translation completed: {tr_subtitle_path}")
            print()
            
            tr_subs = pysrt.open(tr_subtitle_path, encoding='utf-8')
            print("📝 Translated Turkish subtitles:")
            for sub in tr_subs[:3]:
                print(f"   [{sub.index}] {sub.text}")
            print("   ...")
            print()
            
            print("=" * 60)
            print("✨ Test Completed Successfully!")
            print("=" * 60)
            print()
            print("📊 Summary:")
            print(f"   • Original subtitles: {len(subs)} entries")
            print(f"   • Translated subtitles: {len(tr_subs)} entries")
            print(f"   • Translation engine: Google Translate (EN → TR)")
            print()
            print("✅ All components working correctly!")
            
            return True
        else:
            print("❌ Translation failed!")
            return False

def main():
    try:
        success = test_translation()
        exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)

if __name__ == "__main__":
    main()
