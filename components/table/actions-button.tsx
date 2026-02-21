import { EditIcon, TrashIcon } from "lucide-react";

import { Button } from "../ui/button";

export const EditButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button variant="ghost" onClick={onClick}>
      <EditIcon className="h-4 w-4" />
    </Button>
  );
};

export const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button variant="ghost" onClick={onClick}>
      <TrashIcon className="h-4 w-4 text-red-500" />
    </Button>
  );
};
