export type VideoItem = {
  id: string;
  title: string;
  thumbnail: string;
  publish_date: Date;
  duration: number;
};

export const searchResultsMock = (): VideoItem[] =>
  Array.from({ length: 5 + Math.floor(Math.random() * 10) }).map((_, i) => ({
    id: String(i + 1),
    title: `Video ${i + 1}`,
    thumbnail: `https://picsum.photos/300/200?randomize=${Math.random()}`,
    duration: Math.floor(30 + Math.random() * 2000),
    publish_date: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000)
    ),
  }));
