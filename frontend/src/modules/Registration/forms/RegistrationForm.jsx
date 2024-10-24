import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registrationFormSchema } from "@/modules/Registration/forms/schema/registrationSchema.js";
import { useState } from "react";

const fields = [
  {
    name: "fullName",
    placeholder: "Enter Full Name",
    type: "text",
  },
  {
    name: "email",
    placeholder: "Enter Email",
    type: "text",
  },
  {
    name: "password",
    placeholder: "Enter Password",
    type: "text",
  },
];

const RegistrationForm = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const form = useForm({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      image: null,
    },
  });

  const onSubmit = (values) => {
    console.log(values);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the preview URL
      };
      reader.readAsDataURL(file); // Convert file to a data URL
      form.setValue("image", file); // Set the file in the form values
    }
  };

  console.log("imagePreview", imagePreview);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {/*Normal Inputs*/}
        {fields.map((x, idx) => (
          <FormField
            key={idx}
            control={form.control}
            name={x.name}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder={x.placeholder} {...field} type={x.type} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        {/*Normal Inputs*/}
        {/*Image Input*/}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/*Image Input*/}
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Image Preview"
              style={{ maxWidth: "300px", marginTop: "10px" }}
            />
          </div>
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default RegistrationForm;
