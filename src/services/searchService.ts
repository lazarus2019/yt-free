import type { SearchResult, PaginatedResponse } from '@/types';

// Mock search results for demonstration
const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'video',
    title: 'Bohemian Rhapsody - Queen',
    description: 'Official video for Bohemian Rhapsody by Queen',
    thumbnail: 'https://picsum.photos/seed/queen1/320/180',
    duration: 354,
    channelName: 'Queen Official',
    viewCount: 1500000000,
    publishedAt: new Date('2008-08-01'),
  },
  {
    id: '2',
    type: 'video',
    title: 'Hotel California - Eagles',
    description: 'The Eagles performing Hotel California live',
    thumbnail: 'https://picsum.photos/seed/eagles1/320/180',
    duration: 391,
    channelName: 'Eagles',
    viewCount: 800000000,
    publishedAt: new Date('2010-03-15'),
  },
  {
    id: '3',
    type: 'video',
    title: 'Stairway to Heaven - Led Zeppelin',
    description: 'Led Zeppelin - Stairway to Heaven',
    thumbnail: 'https://picsum.photos/seed/ledzep1/320/180',
    duration: 482,
    channelName: 'Led Zeppelin',
    viewCount: 600000000,
    publishedAt: new Date('2012-06-20'),
  },
  {
    id: '4',
    type: 'video',
    title: 'Sweet Child O Mine - Guns N Roses',
    description: 'Guns N Roses performing Sweet Child O Mine',
    thumbnail: 'https://picsum.photos/seed/gnr1/320/180',
    duration: 303,
    channelName: 'Guns N Roses',
    viewCount: 1200000000,
    publishedAt: new Date('2009-12-25'),
  },
  {
    id: '5',
    type: 'video',
    title: 'Smells Like Teen Spirit - Nirvana',
    description: 'Nirvana - Smells Like Teen Spirit Official Music Video',
    thumbnail: 'https://picsum.photos/seed/nirvana1/320/180',
    duration: 279,
    channelName: 'Nirvana',
    viewCount: 1700000000,
    publishedAt: new Date('2011-09-10'),
  },
  {
    id: '6',
    type: 'video',
    title: 'Billie Jean - Michael Jackson',
    description: 'Michael Jackson - Billie Jean (Official Video)',
    thumbnail: 'https://picsum.photos/seed/mj1/320/180',
    duration: 294,
    channelName: 'Michael Jackson',
    viewCount: 1300000000,
    publishedAt: new Date('2009-10-03'),
  },
  {
    id: '7',
    type: 'video',
    title: 'Imagine - John Lennon',
    description: 'John Lennon - Imagine',
    thumbnail: 'https://picsum.photos/seed/lennon1/320/180',
    duration: 187,
    channelName: 'John Lennon',
    viewCount: 900000000,
    publishedAt: new Date('2010-07-12'),
  },
  {
    id: '8',
    type: 'video',
    title: 'Back In Black - AC/DC',
    description: 'AC/DC - Back In Black Official Video',
    thumbnail: 'https://picsum.photos/seed/acdc1/320/180',
    duration: 255,
    channelName: 'AC/DC',
    viewCount: 750000000,
    publishedAt: new Date('2012-02-14'),
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const searchService = {
  async search(
    query: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<SearchResult>> {
    await delay(500); // Simulate network delay

    const normalizedQuery = query.toLowerCase().trim();
    
    const filtered = mockSearchResults.filter(
      (item) =>
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.description?.toLowerCase().includes(normalizedQuery) ||
        item.channelName?.toLowerCase().includes(normalizedQuery)
    );

    // If no filter match, return all mock results for demo
    const results = filtered.length > 0 ? filtered : mockSearchResults;

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = results.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      totalCount: results.length,
      page,
      pageSize,
      hasMore: endIndex < results.length,
    };
  },

  async getSuggestions(query: string): Promise<string[]> {
    await delay(200);

    if (!query.trim()) return [];

    const suggestions = mockSearchResults
      .filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
      .map((item) => item.title)
      .slice(0, 5);

    return suggestions;
  },
};
