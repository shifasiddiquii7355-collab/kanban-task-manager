import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
export default function TaskCard({ task, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
    });
  const style = { transition, transform: CSS.Transform.toString(transform) };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="taskCard">
      <div className="dragTop">
        <div className="dragHandle" {...attributes} {...listeners}>
          ☰
        </div>
      </div>
      <p className="taskName">{task.title}</p>
      <p className="priority">Priority Level:- {task.priority}</p>
      <p>Due Date:- {task.dueDate}</p>
      <div className="btnContainer">{children}</div>
    </div>
  );
}
