import { useDroppable } from "@dnd-kit/core";
export default function Column({ title, children }) {
  const { setNodeRef } = useDroppable({
    id: title,
  });
  return (
    <div ref={setNodeRef} className="column">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
