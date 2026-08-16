import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemHeader,
} from "@/components/ui/item";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMessages } from "@/i18n/LocaleContext";

interface RepeatableCardProps {
  title: string;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  children: ReactNode;
}

export function RepeatableCard({
  title,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
  children,
}: RepeatableCardProps) {
  const t = useMessages().form;

  return (
    <Item variant="outline" className="flex-col items-stretch gap-4">
      <ItemHeader>
        <span className="text-sm font-semibold">{title}</span>
        <ItemActions>
          <ButtonGroup>
            <IconAction
              label={t.moveUp}
              disabled={index === 0}
              onClick={onMoveUp}
            >
              <ArrowUp className="h-4 w-4" />
            </IconAction>
            <IconAction
              label={t.moveDown}
              disabled={index === total - 1}
              onClick={onMoveDown}
            >
              <ArrowDown className="h-4 w-4" />
            </IconAction>
            <IconAction label={t.remove} onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </IconAction>
          </ButtonGroup>
        </ItemActions>
      </ItemHeader>

      <ItemContent className="gap-4">{children}</ItemContent>
    </Item>
  );
}

function IconAction({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
