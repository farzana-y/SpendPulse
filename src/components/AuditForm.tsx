type AuditFormProps = {
  tool: string;
  setTool: (value: string) => void;
};

export default function AuditForm({
  tool,
  setTool,
}: AuditFormProps) {
  return (
    <div>
      <label className="mb-2 block font-medium">
        Tool
      </label>

      <input
        value={tool}
        onChange={(e) => setTool(e.target.value)}
        className="w-full rounded-xl border p-3"
      />
    </div>
  );
}