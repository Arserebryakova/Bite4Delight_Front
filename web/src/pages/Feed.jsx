import React from 'react';
import ReviewCard from '../components/ReviewCard';

export default function Feed() {
  const reviews = [
    { id: 1, place: 'Cafeteria A', title: 'Cold Soup', content: 'Soup was cold and watery.', rating: 4, user: 'Alice', date: '2025-05-10',  },
    { id: 2, place: 'Dining Hall B', title: 'Long Queue', content: 'Waited 30 minutes for lunch.', rating: 6, user: 'Bob', date: '2025-05-09' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark mb-4">Feed</h1>
      {reviews.map(r=>(
        <ReviewCard key={r.id} {...r}/>
      ))}
    </div>
  );
}
