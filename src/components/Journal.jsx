export default function Journal({ journal, setJournal, onSave }) {
  return (
    <div style={{ marginTop: '2rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
      <h3 style={{ color: '#4b5563' }}>📝 Garden Journal</h3>
      <textarea
        rows={3}
        placeholder="Write something about your garden..."
        value={journal}
        onChange={(e) => setJournal(e.target.value)}
        style={{ width: "100%" }}
      ></textarea>
      <br />
      <button onClick={onSave}>Save Journal Entry</button>
    </div>
  );
}
