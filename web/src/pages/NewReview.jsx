// src/pages/NewReview.jsx
import React, { useState, useRef, useEffect } from "react";

export default function NewReview() {
  const [places, setPlaces] = useState([]);

  const [form, setForm] = useState({
    place: "",
    title: "",
    content: "",
    rating: 5,
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const wrapperRef = useRef(null);

  // 1) Load all “Address. Place” entries from /api/locations
  useEffect(() => {
  fetch("/api/locations")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch locations");
      return res.json();
    })
    .then((data) => {
      console.log("Loaded locations:", data);
      setPlaces(data);
    })
    .catch((err) => {
      console.error("Error loading locations:", err);
    });
  }, []);

  // 2) Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSug(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3) On any input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "place") {
      const val = value.toLowerCase();
      // filter for substring matches but exclude exact match
      const filtered = places.filter(
        (p) => p.toLowerCase().includes(val) && p.toLowerCase() !== val
      );
      setSuggestions(filtered);
      setShowSug(filtered.length > 0);
    }
  };

  // 4) Selecting a suggestion
  const handlePlaceSelect = (place) => {
    setForm((prev) => ({ ...prev, place }));
    setShowSug(false);
  };

  // 5) Submit form as before...
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      place: form.place,
      title: form.title,
      content: form.content,
      rating: Number(form.rating),
    };
    fetch(`/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.status === 201) return res.json();
        return res.json().then((err) => {
          throw new Error(err.error || "Failed to create review");
        });
      })
      .then((data) => {
        alert(`Review created with ID: ${data.id}`);
        setForm({ place: "", title: "", content: "", rating: 5 });
      })
      .catch((err) => {
        console.error("Error creating review:", err);
        alert("Не удалось отправить отзыв: " + err.message);
      });
  };

  const pct = (form.rating / 10) * 100;

  return (
    <div className="max-w-2xl mx-auto bg-bg-light dark:bg-bg-dark p-6 rounded-md
                    dark:shadow-[4px_4px_8px_#161616] shadow-[4px_4px_8px_#d1d9e6]">
      <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark mb-4">
        Новый отзыв
      </h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Place autocomplete */}
        <div className="relative" ref={wrapperRef}>
          <label className="block text-text-primary dark:text-text-secondary-dark mb-1">
            Место
          </label>
          <input
            type="text"
            name="place"
            value={form.place}
            onChange={handleChange}
            onFocus={() => {
				// show all places except if user has typed an exact match
				const allExceptExact = places.filter(
					(p) => p.toLowerCase() !== form.place.toLowerCase()
				);
				setSuggestions(allExceptExact);
				setShowSug(allExceptExact.length > 0);
			}}
            required
            className="w-full mt-1 p-2 border rounded bg-inner-light dark:bg-inner-dark
                       text-text-primary dark:text-text-primary-dark"
            placeholder="Начните вводить..."
          />
          {showSug && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-inner-light dark:bg-inner-dark
                           border border-gray-300 dark:border-gray-600 rounded-md max-h-40
                           overflow-auto mt-1 shadow">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handlePlaceSelect(s)}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700
                             cursor-pointer text-text-primary dark:text-text-primary-dark"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>


        {/* Title */}
        <div>
          <label className="block text-text-primary dark:text-text-secondary-dark mb-1">
            Заголовок
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded bg-inner-light dark:bg-inner-dark 
                       text-text-primary dark:text-text-primary-dark"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-text-primary dark:text-text-secondary-dark mb-1">
            Отзыв
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows="4"
            required
            className="w-full mt-1 p-2 border rounded bg-inner-light dark:bg-inner-dark 
                       text-text-primary dark:text-text-primary-dark"
          />
        </div>

        {/* Rating slider */}
        <div>
          <label className="block text-text-primary dark:text-text-secondary-dark mb-1">
            Оценка: {form.rating}
          </label>
          <input
            type="range"
            name="rating"
            min="0"
            max="10"
            step="1"
            value={form.rating}
            onChange={handleChange}
            required
            className="w-full mt-1 rounded-lg appearance-none transition-all duration-300 ease-in-out"
            style={{ "--fill": `${pct}%` }}
          />
          <div className="flex justify-between text-sm mt-1 text-text-secondary dark:text-text-secondary-dark">
            {[...Array(11)].map((_, i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="px-10 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Отправить
        </button>
      </form>
    </div>
  );
}
