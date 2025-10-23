import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HabitCard } from "@/components/habit-card";
import { ReactNode } from "react";
import "@testing-library/jest-dom";

// Mock de fetch
global.fetch = jest.fn();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = "TestQueryClientWrapper";

  return Wrapper;
};

const mockHabit = {
  id: "1",
  name: "Exercise",
  description: "Daily workout routine",
  frequency: "daily",
  goal: 7,
  color: null,
  icon: null,
  active: true,
  userId: "user1",
  createdAt: new Date(),
  updatedAt: new Date(),
  records: [],
};

describe("HabitCard", () => {
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render habit information correctly", () => {
    render(<HabitCard habit={mockHabit} onDelete={mockOnDelete} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("Exercise")).toBeInTheDocument();
    expect(screen.getByText("Daily workout routine")).toBeInTheDocument();
    expect(screen.getByText("daily")).toBeInTheDocument();
  });

  it("should show active badge when habit is active", () => {
    render(<HabitCard habit={mockHabit} onDelete={mockOnDelete} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("should show inactive badge when habit is inactive", () => {
    const inactiveHabit = { ...mockHabit, active: false };

    render(<HabitCard habit={inactiveHabit} onDelete={mockOnDelete} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("should call onDelete when delete button is clicked", async () => {
    // Mock window.confirm
    const mockConfirm = jest.fn(() => true);
    global.confirm = mockConfirm;

    // Mock DELETE fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    });

    render(<HabitCard habit={mockHabit} onDelete={mockOnDelete} />, {
      wrapper: createWrapper(),
    });

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalled();
      expect(mockOnDelete).toHaveBeenCalledWith("1");
    });
  });

  it("should display statistics when available", () => {
    const habitWithRecords = {
      ...mockHabit,
      records: [
        {
          id: "1",
          habitId: "1",
          date: new Date().toISOString(),
          completed: true,
          notes: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    };

    render(<HabitCard habit={habitWithRecords} onDelete={mockOnDelete} />, {
      wrapper: createWrapper(),
    });

    // Verificar que se muestra el componente de estadísticas
    expect(screen.getByText("Current Streak")).toBeInTheDocument();
  });
});
