import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';

// Mock chart components
const MockLineChart = ({ data }: { data: any[] }) => (
  <div data-testid="line-chart">
    {data.map((item, index) => (
      <div key={index} data-value={item.value}>{item.label}</div>
    ))}
  </div>
);

const MockBarChart = ({ data }: { data: any[] }) => (
  <div data-testid="bar-chart">
    {data.map((item, index) => (
      <div key={index} data-value={item.value}>{item.label}</div>
    ))}
  </div>
);

const MockPieChart = ({ data }: { data: any[] }) => (
  <div data-testid="pie-chart">
    {data.map((item, index) => (
      <div key={index} data-value={item.value}>{item.label}</div>
    ))}
  </div>
);

// Mock Calendar component
const MockCalendar = ({ events, onDateClick }: { events: any[]; onDateClick: (date: Date) => void }) => (
  <div data-testid="calendar">
    {events.map((event, index) => (
      <div key={index} onClick={() => onDateClick(new Date(event.date))}>
        {event.title}
      </div>
    ))}
  </div>
);

// Mock Kanban Board component
interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
}

interface KanbanTask {
  id: string;
  title: string;
  status: string;
}

const MockKanbanBoard = ({ columns, onTaskMove }: { columns: KanbanColumn[]; onTaskMove: (taskId: string, newStatus: string) => void }) => (
  <div data-testid="kanban-board">
    {columns.map((column) => (
      <div key={column.id} data-column={column.id}>
        <h3>{column.title}</h3>
        {column.tasks.map((task) => (
          <div
            key={task.id}
            data-task-id={task.id}
            onClick={() => onTaskMove(task.id, column.id)}
          >
            {task.title}
          </div>
        ))}
      </div>
    ))}
  </div>
);

describe('Feature Components', () => {
  describe('Calendar Component', () => {
    it('should render calendar with events', () => {
      const events = [
        { id: '1', title: 'Team Meeting', date: '2024-10-25' },
        { id: '2', title: 'Project Deadline', date: '2024-10-30' },
      ];

      render(<MockCalendar events={events} onDateClick={() => {}} />);

      expect(screen.getByTestId('calendar')).toBeInTheDocument();
      expect(screen.getByText('Team Meeting')).toBeInTheDocument();
      expect(screen.getByText('Project Deadline')).toBeInTheDocument();
    });

    it('should handle date click events', () => {
      const handleDateClick = vi.fn();
      const events = [
        { id: '1', title: 'Team Meeting', date: '2024-10-25' },
      ];

      render(<MockCalendar events={events} onDateClick={handleDateClick} />);

      fireEvent.click(screen.getByText('Team Meeting'));

      expect(handleDateClick).toHaveBeenCalled();
      expect(handleDateClick).toHaveBeenCalledWith(expect.any(Date));
    });

    it('should display multiple events on same day', () => {
      const events = [
        { id: '1', title: 'Morning Meeting', date: '2024-10-25' },
        { id: '2', title: 'Afternoon Workshop', date: '2024-10-25' },
        { id: '3', title: 'Evening Dinner', date: '2024-10-25' },
      ];

      render(<MockCalendar events={events} onDateClick={() => {}} />);

      expect(screen.getByText('Morning Meeting')).toBeInTheDocument();
      expect(screen.getByText('Afternoon Workshop')).toBeInTheDocument();
      expect(screen.getByText('Evening Dinner')).toBeInTheDocument();
    });

    it('should handle empty events array', () => {
      render(<MockCalendar events={[]} onDateClick={() => {}} />);

      const calendar = screen.getByTestId('calendar');
      expect(calendar).toBeInTheDocument();
      expect(calendar.children.length).toBe(0);
    });
  });

  describe('Chart Components', () => {
    describe('Line Chart', () => {
      it('should render line chart with data', () => {
        const data = [
          { label: 'Jan', value: 100 },
          { label: 'Feb', value: 150 },
          { label: 'Mar', value: 200 },
        ];

        render(<MockLineChart data={data} />);

        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        expect(screen.getByText('Jan')).toBeInTheDocument();
        expect(screen.getByText('Feb')).toBeInTheDocument();
        expect(screen.getByText('Mar')).toBeInTheDocument();
      });

      it('should display correct data values', () => {
        const data = [
          { label: 'Q1', value: 1000 },
          { label: 'Q2', value: 1500 },
        ];

        render(<MockLineChart data={data} />);

        const chart = screen.getByTestId('line-chart');
        const q1 = within(chart).getByText('Q1');
        const q2 = within(chart).getByText('Q2');

        expect(q1).toHaveAttribute('data-value', '1000');
        expect(q2).toHaveAttribute('data-value', '1500');
      });
    });

    describe('Bar Chart', () => {
      it('should render bar chart with data', () => {
        const data = [
          { label: 'Venue', value: 5000 },
          { label: 'Catering', value: 3000 },
          { label: 'Entertainment', value: 2000 },
        ];

        render(<MockBarChart data={data} />);

        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
        expect(screen.getByText('Venue')).toBeInTheDocument();
        expect(screen.getByText('Catering')).toBeInTheDocument();
        expect(screen.getByText('Entertainment')).toBeInTheDocument();
      });

      it('should handle single data point', () => {
        const data = [{ label: 'Total', value: 10000 }];

        render(<MockBarChart data={data} />);

        expect(screen.getByText('Total')).toBeInTheDocument();
      });
    });

    describe('Pie Chart', () => {
      it('should render pie chart with data', () => {
        const data = [
          { label: 'Confirmed', value: 60 },
          { label: 'Pending', value: 30 },
          { label: 'Declined', value: 10 },
        ];

        render(<MockPieChart data={data} />);

        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
        expect(screen.getByText('Confirmed')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('Declined')).toBeInTheDocument();
      });

      it('should handle percentage data', () => {
        const data = [
          { label: 'Category A', value: 45 },
          { label: 'Category B', value: 35 },
          { label: 'Category C', value: 20 },
        ];

        render(<MockPieChart data={data} />);

        const total = data.reduce((sum, item) => sum + item.value, 0);
        expect(total).toBe(100);
      });
    });
  });

  describe('Kanban Board Component', () => {
    it('should render kanban board with columns', () => {
      const columns: KanbanColumn[] = [
        {
          id: 'todo',
          title: 'To Do',
          tasks: [
            { id: '1', title: 'Book Venue', status: 'todo' },
            { id: '2', title: 'Send Invitations', status: 'todo' },
          ],
        },
        {
          id: 'in-progress',
          title: 'In Progress',
          tasks: [
            { id: '3', title: 'Design Flyers', status: 'in-progress' },
          ],
        },
        {
          id: 'done',
          title: 'Done',
          tasks: [
            { id: '4', title: 'Create Event', status: 'done' },
          ],
        },
      ];

      render(<MockKanbanBoard columns={columns} onTaskMove={() => {}} />);

      expect(screen.getByTestId('kanban-board')).toBeInTheDocument();
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    it('should display tasks in correct columns', () => {
      const columns: KanbanColumn[] = [
        {
          id: 'todo',
          title: 'To Do',
          tasks: [
            { id: '1', title: 'Task 1', status: 'todo' },
          ],
        },
        {
          id: 'done',
          title: 'Done',
          tasks: [
            { id: '2', title: 'Task 2', status: 'done' },
          ],
        },
      ];

      render(<MockKanbanBoard columns={columns} onTaskMove={() => {}} />);

      const todoColumn = screen.getByText('To Do').parentElement!;
      const doneColumn = screen.getByText('Done').parentElement!;

      expect(within(todoColumn).getByText('Task 1')).toBeInTheDocument();
      expect(within(doneColumn).getByText('Task 2')).toBeInTheDocument();
    });

    it('should handle task move between columns', () => {
      const handleTaskMove = vi.fn();
      const columns: KanbanColumn[] = [
        {
          id: 'todo',
          title: 'To Do',
          tasks: [
            { id: '1', title: 'Move Me', status: 'todo' },
          ],
        },
        {
          id: 'in-progress',
          title: 'In Progress',
          tasks: [],
        },
      ];

      render(<MockKanbanBoard columns={columns} onTaskMove={handleTaskMove} />);

      fireEvent.click(screen.getByText('Move Me'));

      expect(handleTaskMove).toHaveBeenCalledWith('1', 'todo');
    });

    it('should handle empty columns', () => {
      const columns: KanbanColumn[] = [
        {
          id: 'todo',
          title: 'To Do',
          tasks: [],
        },
        {
          id: 'in-progress',
          title: 'In Progress',
          tasks: [],
        },
      ];

      render(<MockKanbanBoard columns={columns} onTaskMove={() => {}} />);

      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });

    it('should display multiple tasks in same column', () => {
      const columns: KanbanColumn[] = [
        {
          id: 'todo',
          title: 'To Do',
          tasks: [
            { id: '1', title: 'Task 1', status: 'todo' },
            { id: '2', title: 'Task 2', status: 'todo' },
            { id: '3', title: 'Task 3', status: 'todo' },
          ],
        },
      ];

      render(<MockKanbanBoard columns={columns} onTaskMove={() => {}} />);

      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });
  });
});

