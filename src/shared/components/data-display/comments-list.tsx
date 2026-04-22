import type { Comment } from "@/core/types/domain";
import { stringToHslColor } from "@/lib/utils/colors";
import { formatAbsoluteDate, formatRelativeDate } from "@/lib/utils/date";
import { getInitialsFromContent } from "@/lib/utils/text";
import { Button } from "@/shared/ui/button";
import { MessageSquare, Pencil } from "lucide-react";

export type CommentsListProps = {
  comments: Comment[];
  onEditComment: (comment: Comment) => void;
};

export function CommentsList({ comments, onEditComment }: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Nenhum comentario</p>
          <p className="text-xs text-muted-foreground">Seja o primeiro a adicionar uma observacao.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 overflow-y-auto pr-1" style={{ maxHeight: "360px" }}>
      {comments.map((comment) => {
        const avatarColor = stringToHslColor(comment.id, 60, 45);
        const initials = getInitialsFromContent(comment.content);

        return (
          <div key={comment.id} className="group flex items-start gap-3 border-b border-border/50 py-3 last:border-b-0">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: avatarColor }}
              aria-hidden="true"
            >
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <time
                  className="text-xs text-muted-foreground"
                  dateTime={comment.createdAt}
                  title={formatAbsoluteDate(comment.createdAt)}
                >
                  {formatRelativeDate(comment.createdAt)}
                  {comment.updatedAt ? " (editado)" : null}
                </time>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 px-0 opacity-100 transition-opacity group-hover:opacity-100 sm:opacity-0"
                  onClick={() => onEditComment(comment)}
                  aria-label="Editar comentario"
                >
                  <Pencil className="h-3 w-3 text-muted-foreground" />
                </Button>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">{comment.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
