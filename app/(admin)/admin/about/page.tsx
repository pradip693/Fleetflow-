export default function AboutPage() {
  return (
    <div className="container mx-auto py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          About This Project
        </h1>
        <p className="text-muted-foreground text-lg">
          Description of the project
        </p>
      </div>

      <div>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Placeat,
        veritatis!
      </div>
    </div>
  );
}
