import styles from '../styles/MovieInf.module.css'

const YouTubeEmbed = ({ videoId }: { videoId: any }) => (
    <iframe className={styles.youtube}
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0`}
      allowFullScreen
      title="Embedded YouTube Video"
    />
);

export default YouTubeEmbed;
