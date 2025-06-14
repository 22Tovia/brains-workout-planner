'use client';

import AddWorkoutForm from '../../components/ui/AddWorkoutForm';
import React, { useState, useEffect } from 'react';
import { getUserId } from '../../lib/getUserId';
import { fetchWorkouts } from '../../lib/workouts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '../../components/ui/card';

type Workout = {
  id: string;
  name: string;
  description?: string;
  date: string;
  category?: string;
  completed: boolean;
};

const categories = ['Upper Body', 'Lower Body', 'Full Body', 'Cardio'];

export default function Dashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    const load = async () => {
      const id = await getUserId();
      if (!id) return;

      setUserId(id);

      const saved = localStorage.getItem('workouts');
      if (saved) {
        setWorkouts(JSON.parse(saved));
        return;
      }

      const data = await fetchWorkouts(id);
      if (Array.isArray(data)) {
        const mapped = data.map((w: any) => ({
          ...w,
          completed: false,
          description: w.description || '',
        }));
        setWorkouts(mapped);
      } else {
        setWorkouts([]);
      }
    };

    load();
  }, []);

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  const handleAddWorkout = (newWorkout: {
    name: string;
    description?: string;
    category?: string;
    date: string;
  }) => {
    setWorkouts((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: newWorkout.name,
        description: newWorkout.description || '',
        date: newWorkout.date,
        category: newWorkout.category,
        completed: false,
      },
    ]);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this workout?')) {
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    }
  };

  const handleEdit = (id: string) => {
    const workout = workouts.find((w) => w.id === id);
    if (!workout) return;

    const newName = prompt('Edit workout name:', workout.name);
    const newDescription = prompt('Edit workout description:', workout.description || '');
    const newDate = prompt('Edit workout date (YYYY-MM-DD):', workout.date);
    const newCategory = prompt('Edit workout category:', workout.category || '');

    if (newName && newDate) {
      setWorkouts((prev) =>
        prev.map((w) =>
          w.id === id
            ? {
                ...w,
                name: newName,
                description: newDescription || '',
                date: newDate,
                category: newCategory || undefined,
              }
            : w
        )
      );
    }
  };

  const toggleComplete = (id: string) => {
    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, completed: !w.completed } : w
      )
    );
  };

  const filteredWorkouts =
    filter === 'All'
      ? workouts
      : workouts.filter((w) => w.category === filter);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 bg-gray-50 min-h-screen rounded-md shadow-md">
      <h1 className="text-4xl font-extrabold text-center text-green-700 mb-10 tracking-wide drop-shadow-sm">
        Your Workout Dashboard
      </h1>

      <section className="mb-8">
        <AddWorkoutForm onAdd={handleAddWorkout} />
      </section>

      <section className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-sm text-gray-600">Logged in as: <span className="font-medium text-green-800">{userId || 'Guest'}</span></p>

        <div className="flex items-center space-x-3">
          <label htmlFor="category-filter" className="font-semibold text-gray-700">
            Filter by category:
          </label>
          <select
            id="category-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="All">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Workouts</h2>

        {filteredWorkouts.length === 0 ? (
          <p className="text-center text-gray-500 italic">No workouts found. Add one above!</p>
        ) : (
          <ul className="space-y-6">
            {filteredWorkouts.map((workout) => (
              <Card
                key={workout.id}
                className={`border rounded-lg shadow-md transition-all duration-300 ease-in-out ${
                  workout.completed ? 'bg-green-50 border-green-400' : 'bg-white border-gray-300 hover:shadow-lg'
                }`}
              >
                <CardHeader className="flex justify-between items-center">
                  <CardTitle
                    className={`text-xl font-semibold ${
                      workout.completed ? 'line-through text-green-600' : 'text-gray-900'
                    }`}
                  >
                    {workout.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500 italic">
                    {workout.category || 'Uncategorized'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <p
                    className={`text-gray-700 ${workout.completed ? 'line-through text-green-600' : ''}`}
                  >
                    {workout.description || <em>No description</em>}
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-600">
                    📅 Date: <time dateTime={workout.date}>{workout.date}</time>
                  </p>
                </CardContent>

                <CardFooter className="flex flex-wrap gap-3 pt-4">
                  <button
                    onClick={() => toggleComplete(workout.id)}
                    className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${
                      workout.completed
                        ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {workout.completed ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>

                  <button
                    onClick={() => handleEdit(workout.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(workout.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </CardFooter>
              </Card>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
