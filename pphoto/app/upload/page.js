"use client";
// pages/upload.js
import { useState } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { formSchema } from '../schemas/formSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default function UploadPage () {
  const [tags, setTags] = useState([]);
  const [date, setDate] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedFile: null,
      photoName: "",
      description: "",
      tags: [],
      photoDate: null,
      photoType: ""
    }
  })

  const { register, handleSubmit, setValue, getValues } = form;

  const onSubmit = (values) => {
    console.log(values);
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setValue("selectedFile", file);
    setValue("photoName", file.name);
    setValue("photoDate", file.lastModifiedDate)
  };

  const handleDelete = (i) => {
    const newTags = tags.filter((tag, index) => index !== i);
    setTags(newTags);
    setValue("tags", newTags);
  };

  const handleAddition = (tag) => {
    const newTags = [...tags, tag];
    setTags(newTags);
    setValue("tags", newTags);
  };

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    setValue("photoDate", selectedDate);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Upload Photo</h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name="selectedFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload photo</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*" onChange={handleFileChange} />
                </FormControl>
                <FormDescription>
                  Use this input field to upload a new photo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="photoName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Photo Name"
                    {...register('photoName')}
                  />
                </FormControl>
                <FormDescription>
                  Use this input field to add a name of the photo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    {...register('description')}
                  />
                </FormControl>
                <FormDescription>
                  Use this input field to write a short description
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="photoDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        {...register('photoDate')}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Use this input field to select date when picture was taken
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="photoType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Select photo type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                      <SelectItem value="macro">Macro</SelectItem>
                      <SelectItem value="street">Street</SelectItem>
                      <SelectItem value="screenshot">Screenshot</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Use this input field to select type of the photo that is uploaded
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          {/* <div className="mb-4">
            <ReactTags
              tags={tags}
              handleDelete={handleDelete}
              handleAddition={handleAddition}
              delimiters={delimiters}
            />
          </div> */}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div >
  );
}
