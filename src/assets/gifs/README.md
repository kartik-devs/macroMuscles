# Workout GIFs Guide

This folder contains image sequences that create GIF-like animations for workout demonstrations.

## Folder Structure
```
src/assets/gifs/
├── pushup/
│   ├── pushup_1.jpg
│   ├── pushup_2.jpg
│   ├── pushup_3.jpg
│   └── pushup_4.jpg
├── squat/
│   ├── squat_1.jpg
│   ├── squat_2.jpg
│   └── squat_3.jpg
└── plank/
    ├── plank_1.jpg
    └── plank_2.jpg
```

## Creating Image Sequences

### 1. **Capture Images**
- Take 3-5 photos of the exercise in sequence
- Use consistent lighting and background
- Ensure smooth transitions between poses
- Keep the same framing and angle

### 2. **Image Requirements**
- **Format**: JPG or PNG
- **Size**: 400x400px minimum (square aspect ratio works best)
- **Naming**: Use descriptive names with numbers (e.g., `pushup_1.jpg`)
- **Quality**: High quality but optimized for mobile

### 3. **Best Practices**
- **Smooth transitions**: Each image should flow naturally to the next
- **Key positions**: Capture the most important form points
- **Consistent timing**: Space your photos evenly through the movement
- **Clean background**: Use a solid color or simple background

## Using in Components

### Basic Usage
```javascript
import WorkoutGIF from '../components/WorkoutGIF';

const images = [
  require('../assets/gifs/pushup/pushup_1.jpg'),
  require('../assets/gifs/pushup/pushup_2.jpg'),
  require('../assets/gifs/pushup/pushup_3.jpg'),
  require('../assets/gifs/pushup/pushup_4.jpg'),
];

<WorkoutGIF
  images={images}
  duration={2000}
  loop={true}
  autoPlay={true}
  showControls={true}
/>
```

### Advanced Usage with Instructions
```javascript
import WorkoutAnimation from '../components/WorkoutAnimation';

<WorkoutAnimation
  exerciseName="Push-Up"
  images={images}
  duration={2000}
  showInstructions={true}
  instructions={[
    "Start in a plank position",
    "Lower your body slowly",
    "Push back up to starting position"
  ]}
/>
```

## Animation Properties

- **duration**: Time between image transitions (milliseconds)
- **loop**: Whether to repeat the animation
- **autoPlay**: Start animation automatically
- **showControls**: Display play/pause buttons
- **onAnimationComplete**: Callback when animation finishes

## Tips for Better Animations

1. **Smooth Transitions**: Use fade effects between images
2. **Appropriate Speed**: 1.5-3 seconds per cycle works well
3. **Loop Control**: Let users pause/resume animations
4. **Progress Indicators**: Show current position in sequence
5. **Responsive Design**: Ensure animations work on all screen sizes

## Example Workouts to Create

- **Push-ups**: 4 images (start, down, up, hold)
- **Squats**: 3 images (start, down, up)
- **Plank**: 2 images (start, hold)
- **Burpees**: 5 images (start, squat, plank, push-up, jump)
- **Lunges**: 3 images (start, down, up)
