import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
  // State to store any errors encountered during the request
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      // Reset errors before making each request.
      setErrors(null);
      const response = await axios[method](url, body);
      if (onSuccess) {
        onSuccess(response.data); // on success redirecting to some other page
      }
      return response.data;
    } catch (err) {
      // If an error occurs, set the errors state with the error messages.
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
  // you can return like this [doRequest, errors] like standard way, above one is also fine
};

export default useRequest;
