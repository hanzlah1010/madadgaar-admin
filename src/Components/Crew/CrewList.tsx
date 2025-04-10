import CrewMember from "./CrewMember";
import { CrewMemeber } from "../../schemas/crew_member";

const CrewList = ({
  crew,
  onUpdate,
  onDelete,
}: {
  crew: CrewMemeber[];
  onUpdate: (updatedMember: CrewMemeber) => void;
  onDelete: (id: number) => void;
}) => {
  return (
    <div className="mt-3">
      <h3>Crew Members</h3>
      {crew.length > 0 ? (
        <ul className="list-group">
          {crew.map((member) => (
            <CrewMember
              key={member.id}
              member={member}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </ul>
      ) : (
        <p>No crew members in this category yet.</p>
      )}
    </div>
  );
};

export default CrewList;
