import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./custom.css";
import { ko } from "date-fns/locale";
import { getMonth, getYear } from "date-fns";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const MONTHS = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

// ** DayPicker Props 타입 정의
interface DayPickerProps {
  startDate: Date | undefined;
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  endDate: Date | undefined;
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  onConfirm: () => void; // 날짜 선택 완료 시 호출할 함수
}

const DayPicker: React.FC<DayPickerProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onConfirm,
}) => {
  const [selectedYear, setSelectedYear] = React.useState<number>(getYear(new Date()));

  const handleDateChange = (dates: [Date | null, Date | null] | null) => {
    if (dates) {
      const [start, end] = dates;
      setStartDate(start || undefined);
      setEndDate(end || undefined);
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  const CustomInput = React.forwardRef<HTMLButtonElement, any>(
    ({ value, onClick }, ref) => (
      <button className="input-box" onClick={onClick} ref={ref}>
        {value || "날짜 선택"}
      </button>
    )
  );

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value));
  };

  return (
    <div className="datepicker-frame w-[517px] h-[620px]">
      <div className="font-bold text-[1.2rem] mb-2">언제 가시나요?</div>
      <div className="font-bold text-[1.2rem] mb-4">날짜를 선택해주세요.</div>
      <div>
        <DatePicker
          withPortal
          dateFormat="MM.dd"
          inline
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateChange}
          wrapperClassName="input-attribute"
          customInput={<CustomInput />}
          excludeDateIntervals={[
            {
              start: new Date(),
              end: new Date(new Date().setDate(new Date().getDate() + 2)),
            },
          ]}
          locale={ko}
          renderCustomHeader={({ monthDate, decreaseMonth, increaseMonth }) => {
            const currentMonth = getMonth(monthDate);
            return (
              <div className="custom-header">
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="year-select"
                >
                  {[...Array(10)].map((_, index) => {
                    const year = getYear(new Date()) + index;
                    return (
                      <option key={year} value={year}>
                        {year}년
                      </option>
                    );
                  })}
                </select>
                <button type="button" onClick={decreaseMonth} className="month-button">
                  <FaChevronLeft />
                </button>
                <span className="month">{MONTHS[currentMonth]}</span>
                <button type="button" onClick={increaseMonth} className="month-button">
                  <FaChevronRight />
                </button>
              </div>
            );
          }}
        />
        <div className="button-container">
          <button className="button1" onClick={onConfirm}>
            선택
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayPicker;
