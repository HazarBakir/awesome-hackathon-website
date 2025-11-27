import { useEffect, useReducer } from "react";
import { Star } from "lucide-react";
import { fetchRepoStars } from "./api";

interface RepoStarsProps {
  owner?: string;
  repo?: string;
}

type State = {
  loading: boolean;
  stars: number | null;
};

type Action =
  | { type: "LOADING" }
  | { type: "LOADED"; stars: number | null }
  | { type: "RESET" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true };
    case "LOADED":
      return { loading: false, stars: action.stars };
    case "RESET":
      return { loading: false, stars: null };
    default:
      return state;
  }
}

export function RepoStars({ owner, repo }: RepoStarsProps) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    stars: null,
  });

  useEffect(() => {
    let cancelled = false;

    if (!owner || !repo) {
      dispatch({ type: "RESET" });
      return;
    }

    dispatch({ type: "LOADING" });

    fetchRepoStars(owner, repo).then((stars) => {
      if (!cancelled) {
        dispatch({ type: "LOADED", stars });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [owner, repo]);

  return (
    <span
      className="bg-background border border-border rounded-full px-[7px] py-px flex items-center gap-1 shadow-sm min-w-[36px] h-6 mr-1"
      style={{
        fontSize: "0.75rem",
        boxShadow: "0 1px 2px 0 rgba(16,30,54,.04)",
      }}
      aria-label="GitHub stars"
      title={
        state.stars !== null ? `${state.stars} GitHub stars` : "GitHub stars"
      }
    >
      <Star
        size={14}
        fill="currentColor"
        stroke="none"
        className="mr-1 text-yellow-400"
        aria-hidden="true"
      />
      {state.loading ? (
        <span className="animate-pulse" style={{ width: 18 }}>
          --
        </span>
      ) : state.stars !== null ? (
        <span>{state.stars.toLocaleString()}</span>
      ) : (
        <span>--</span>
      )}
    </span>
  );
}
