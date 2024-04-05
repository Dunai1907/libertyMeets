type ErrorTextType = {
  [errorCode: number]: string;
};

const errorText: ErrorTextType = {
  200: "",
  404: "Sorry, the email address you entered could not be found.",
  500: "Sorry, an error has occurred. Please try again later or contact technical support for further assistance.",
};

export default function ResetPasswodTextStatus({
  errCode,
}: {
  errCode: number;
}) {
  return (
    <>
      <p>
        {errCode in errorText
          ? errorText[errCode]
          : `Unknown error. Error code - ${errCode}`}
      </p>
    </>
  );
}
