import React from 'react';

const Calendar = ({ onDateSelect }) => {
    const renderDays = () => {
        const days = [];
        for (let i = 1; i <= 30; i++) {
            days.push(
                <div key={i} className="calendar-day" onClick={() => onDateSelect(i)}>
                    {i}
                </div>
            );
        }
        return days;
    };

    return (
        <div className="calendar">
            <div className="calendar-header">
                <h2>Calendar</h2>
            </div>
            <div className="calendar-body">
                {renderDays()}
            </div>
        </div>
    );
};

export default Calendar;