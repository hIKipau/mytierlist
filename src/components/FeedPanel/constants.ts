import type { FeedItem } from "./types";

export const FEED_PREVIEW: FeedItem[] = [
  {
    id: "f-1",
    type: "post",
    title: "Обсуждение новых шаблонов для аниме-тирлистов",
    author: "@sampleUser",
    summary: "Плейсхолдер поста: текстовые публикации пользователей будут показываться в общем потоке.",
  },
  {
    id: "f-2",
    type: "tierlist",
    title: "Тирлист лучших кооперативных игр",
    author: "@tiermaker",
    summary: "Плейсхолдер тирлиста: карточки готовых тирлистов выводятся вместе с постами.",
  },
  {
    id: "f-3",
    type: "media",
    title: "Медиа-подборка: кадры и обложки",
    author: "@mediaDrop",
    summary: "Плейсхолдер медиа: изображения, видео и другие медиа-посты отображаются в ленте.",
  },
];
