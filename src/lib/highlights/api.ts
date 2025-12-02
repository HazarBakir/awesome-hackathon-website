import { supabase } from "@/lib/supabase";
import type { Highlight, HighlightSelection } from "@/types/highlight";

export async function createHighlight(
  sessionId: string,
  selection: HighlightSelection
): Promise<Highlight | null> {
  try {
    const { data, error } = await supabase
      .from("highlights")
      .insert({
        session_id: sessionId,
        text_content: selection.text,
        start_offset: selection.startOffset,
        end_offset: selection.endOffset,
        container_xpath: selection.containerXPath,
        color: selection.color,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating highlight:", error);
      return null;
    }

    return data as Highlight;
  } catch (error) {
    console.error("Exception creating highlight:", error);
    return null;
  }
}

export async function getHighlights(sessionId: string): Promise<Highlight[]> {
  try {
    const { data, error } = await supabase
      .from("highlights")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching highlights:", error);
      return [];
    }

    return (data as Highlight[]) || [];
  } catch (error) {
    console.error("Exception fetching highlights:", error);
    return [];
  }
}

export async function deleteHighlight(highlightId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("highlights")
      .delete()
      .eq("id", highlightId);

    if (error) {
      console.error("Error deleting highlight:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception deleting highlight:", error);
    return false;
  }
}
