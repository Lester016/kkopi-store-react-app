import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../shared/api/axiosInstance';

interface DaySchedule {
  shiftStart?: string;
  shiftEnd?: string;
}

export interface WeeklySchedule {
  [day: string]: DaySchedule;
}

const daysOfWeek: string[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const SchedulePage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { name } = location.state as { name: string };
  const [schedule, setSchedule] = useState<WeeklySchedule>({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axiosInstance.get(`/api/users/${id}/schedule`);
        console.log('Fetched Schedule:', response.data.schedule);
        if (response.data.schedule) {
          setSchedule(response.data.schedule);
        }
      } catch (error) {
        console.error('Failed to fetch schedule:', error);
        setErrorMessage(error.message);
      }
    };

    fetchSchedule();
  }, [id]);

  const handleChange = (day: string, field: keyof DaySchedule, value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const toggleDay = (day: string) => {
    setSchedule((prev) => {
      const updated = { ...prev };
      updated[day] = { shiftStart: '', shiftEnd: '' }; // Empty out the day's schedule
      return updated;
    });
  };

  const handleSubmit = async () => {
    try {
      const filteredSchedule = Object.fromEntries(
        Object.entries(schedule).filter(([, value]) => value.shiftStart || value.shiftEnd)
      );
      const payload = { schedule: filteredSchedule };
      const response = await axiosInstance.put(`/api/users/${id}/schedule`, payload);
      console.log('Schedule submitted successfully:', response.data);
    } catch (error) {
      console.error('Failed to submit schedule:', error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">{name}'s Schedule</h1>

      <div className="space-y-6">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="bg-white rounded-2xl shadow-md px-6 py-5 transition-all hover:shadow-lg"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <span className="w-full md:w-[160px] font-medium text-gray-700">{day}</span>

              <>
                <input
                  type="time"
                  value={schedule[day]?.shiftStart || ''}
                  onChange={(e) => handleChange(day, 'shiftStart', e.target.value)}
                  className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-[135px]"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="time"
                  value={schedule[day]?.shiftEnd || ''}
                  onChange={(e) => handleChange(day, 'shiftEnd', e.target.value)}
                  className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-[135px]"
                />
                <button
                  onClick={() => toggleDay(day)}
                  className="text-red-500 hover:text-red-700 ml-auto md:ml-0"
                >
                  Remove
                </button>
              </>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="px-5 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default SchedulePage;
