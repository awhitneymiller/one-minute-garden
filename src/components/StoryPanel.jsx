import { storyBeats } from "../data/story";

export default function StoryPanel({ storyIndex }) {
  return (
    <div style={{ margin: '1rem 0', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
      <h3 style={{ color: '#4b5563' }}>📖 Garden Story</h3>
      <p>{storyBeats[storyIndex]}</p>
    </div>
  );
}
