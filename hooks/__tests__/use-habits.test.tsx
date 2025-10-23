import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHabits } from "@/hooks/use-habits";
import { ReactNode } from "react";

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

describe("useHabits", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch habits successfully", async () => {
    const mockHabits = [
      {
        id: "1",
        name: "Exercise",
        description: "Daily workout",
        frequency: "daily",
        active: true,
        userId: "user1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        records: [],
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockHabits,
    });

    const { result } = renderHook(() => useHabits(), {
      wrapper: createWrapper(),
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.habits).toEqual(mockHabits);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    const { result } = renderHook(() => useHabits(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.habits).toEqual([]);
    expect(result.current.error).toBeTruthy();
  });

  it("should create a new habit", async () => {
    const mockHabits: (typeof newHabit)[] = [];
    const newHabit = {
      id: "1",
      name: "Read",
      description: "Read books",
      frequency: "daily",
      goal: 7,
      active: true,
      userId: "user1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      records: [],
    };

    // Mock inicial GET
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockHabits,
    });

    const { result } = renderHook(() => useHabits(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Mock POST para crear
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => newHabit,
    });

    // Mock GET después de crear
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [newHabit],
    });

    await result.current.createHabit({
      name: "Read",
      description: "Read books",
      frequency: "daily",
      goal: 7,
    });

    await waitFor(() => {
      expect(result.current.habits).toHaveLength(1);
    });
  });
});
