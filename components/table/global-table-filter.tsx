import { DataTableToolbarCompact, FilterConfig } from "./table-toolbar";

const GlobalFilterSection = ({ filters }: { filters: FilterConfig[] }) => {
  return (
    <div className="my-4">
      <DataTableToolbarCompact filters={filters} />
    </div>
  );
};

export default GlobalFilterSection;
