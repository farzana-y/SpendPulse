type ResultCardProps = {
  title: string;
  value: string | number;
};

export default function ResultCard({
  title,
  value,
}: ResultCardProps) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}