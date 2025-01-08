import React from "react";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";

import { Button } from "../common/Button";
import { TextField } from "../common/TextField";

interface IValues {
  description: string;
}

const validationSchema = Yup.object().shape({
  description: Yup.string().required("error: must not be empty"),
});

interface ToDoFormProps {
  onAddTask: (description: string) => void;
}

export const ToDoForm: React.FC<ToDoFormProps> = ({ onAddTask }) => {
  const initialValues: IValues = {
    description: "",
  };

  const handleSubmit = (values: IValues, { resetForm }: any) => {
    onAddTask(values.description);
    resetForm(); // für clear
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ errors, touched }) => (
          <Form className="shadow border rounded-xl p-4 my-4">
            <div className="my-4">
              <label htmlFor="description" className="font-bold">
                Question
              </label>
              <Field
                name="description"
                id="description"
                component={TextField}
                placeholder="Enter question"
                autoFocus
              />
              {errors.description && touched.description && (
                <div className="text-red-500 text-sm">{errors.description}</div>
              )}
            </div>
            <Button text="Add" />
          </Form>
        )}
      </Formik>
    </div>
  );
};