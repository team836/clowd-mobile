export type FileInfo = {
  path: string
  size: number
}

const sample: FileInfo[] = [
  {
    path: '/image.png',
    size: 12.0,
  },
  {
    path: '/photos/newyork.jpg',
    size: 4.2,
  },
  {
    path: '/photos/brooklyn-bridge.jpg',
    size: 13.7,
  },
  {
    path: '/photos/selfies/me.jpg',
    size: 8.61,
  },
  {
    path: '/icons/file-icon.png',
    size: 0.78,
  },
  {
    path: '/icons/clowd-icon.png',
    size: 0.52,
  },
  {
    path: '/texts/memo.txt',
    size: 0.012,
  },
  {
    path: '/robots.txt',
    size: 0.02,
  },
]

export default sample
