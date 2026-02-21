import { Plus } from "lucide-react";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface TablePageHeaderProps {
  title?: string;
  children?: React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  showActionButton?: boolean;
  showIcon?: boolean;
  showSeparator?: boolean;
}

function PageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl font-bold">{children}</h1>;
}

const TablePageHeader = ({
  title,
  children,
  buttonText = "Add",
  onButtonClick,
  showActionButton = true,
  showIcon = true,
  showSeparator = true,
}: Readonly<TablePageHeaderProps>) => {
  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <div>
          <PageTitle>{title}</PageTitle>
          <span className="font-lexend text-sm font-normal text-[#848485]">{children}</span>
        </div>
        {showActionButton && (
          <div>
            <Button onClick={onButtonClick} size={"lg"}>
              {showIcon && <Plus />}
              {buttonText}
            </Button>
          </div>
        )}
      </div>
      {showSeparator && <Separator />}
    </>
  );
};

export default TablePageHeader;
