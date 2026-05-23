

export default function SubmitButton({disabled=false}:{disabled: boolean}) {


  return (
    <button type="submit" disabled={disabled} className="w-full bg-primary text-primary-contrast font-medium py-2.5 rounded-medium hover:bg-primary-dark transition disabled:bg-primary-light disabled:cursor-not-allowed">
      {disabled ? "Saving..." : "Submit"}
    </button>
  );
}
