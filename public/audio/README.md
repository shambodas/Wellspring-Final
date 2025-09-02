# Audio Files for Sound Therapy

This directory contains audio files for the Sound Therapy component.

## Adding Audio Files

To add your own audio files:

1. Place your audio files in this directory
2. Update the `playlists` array in `src/pages/SoundTherapy.jsx`
3. Use relative paths like `/audio/your-file.mp3`

## Recommended Audio Formats

- **MP3** - Most compatible, smaller file size
- **WAV** - High quality, larger file size
- **OGG** - Good quality, smaller than WAV

## Working Audio URLs

If you want to use external audio files, here are some reliable sources:

### Free Sound Libraries:
1. **Freesound.org** - Community-driven sound library
2. **Zapsplat** - Professional sound effects (free tier available)
3. **BBC Sound Effects** - High-quality nature sounds

### Direct URLs (Tested):
- Rain sounds: `https://www.soundjay.com/misc/sounds/rain-01.mp3`
- Ocean waves: `https://www.soundjay.com/misc/sounds/ocean-wave-1.mp3`
- Forest sounds: `https://www.soundjay.com/misc/sounds/forest-1.mp3`

## Local Audio Setup

For production use, we recommend:

1. Download royalty-free audio files
2. Place them in this `/public/audio/` directory
3. Update the URLs in the component to use local paths like `/audio/rain.mp3`

## Example Local Audio Structure

```
public/audio/
├── rain.mp3
├── ocean-waves.mp3
├── forest-birds.mp3
├── gentle-stream.mp3
├── tibetan-bowls.mp3
├── soft-piano.mp3
└── wind-chimes.mp3
```

## Troubleshooting

If audio files don't play:

1. Check browser console for CORS errors
2. Verify audio file format is supported
3. Try different audio sources
4. Use local audio files for better reliability
