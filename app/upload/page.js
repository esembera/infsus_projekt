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
import { storage } from '@/firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Loader from '../components/loader';

const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default function UploadPage () {
  const [file, setFile] = useState('')
  const [tags, setTags] = useState([]);
  const [buttonClass, setButtonClass] = useState('')
  const [pictureUploading, setPictureUploading] = useState(false)
  const [postInProgress, setPostInProgress] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedFileUrl: '',
      username: "",
      photoName: "",
      description: "",
      tags: [],
      photoDate: '',
      photoType: "",
      likes: 0,
      comments: []
    }
  })



  const { register, handleSubmit, setValue, getValues } = form;

  const onSubmit = async (values) => {
    console.log(values);
    setButtonClass('cursor-not-allowed pointer-events-none opacity-50')
    if (file) {
      setPictureUploading(true)
      const name = file.name;
      const storageRef = ref(storage, `image/${name}`);

      try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        setValue('selectedFileUrl', url);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('An error occurred while uploading the file.');
        return; // Exit the function if file upload fails
      }
    } else {
      form.setError("selectedFile", { message: 'Photo must be selected.' })
      return
    }
    setPictureUploading(false)
    setPostInProgress(true)
    try {
      const response = await fetch('/api/pictures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(getValues()),
      });

      if (response.ok) {
        alert('Data submitted successfully!');
      } else {
        const result = await response.json();
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending data:', error);
      alert('An error occurred while submitting the form.');
    }
    setPostInProgress(false)
    setButtonClass('')
    form.reset()
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file.size > 10000000) {
      form.setError("selectedFile", { message: 'File size too large' })
    } else {
      setFile(file)
      setValue("photoName", file.name);
    }
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Upload Picture Form</h1>
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
          <div className='flex justify-between'>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="flex flex-col w-1/4">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Username"
                      {...register('username')}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Use this input field to add your username
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name="photoName"
              render={({ field }) => (
                <FormItem className="flex flex-col w-4/6">
                  <FormLabel>Photo Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Photo Name"
                      {...register('photoName')}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Use this input field to add a name of the photo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Use this input field to write a short description
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          <div className='flex justify-between'>
            <FormField
              control={form.control}
              name="photoDate"
              render={({ field }) => (
                <FormItem className="flex flex-col w-1/2">
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
                <FormItem className="flex flex-col w-1/2">
                  <FormLabel>Photo type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          </div>
          <div className='flex w-2/6 justify-center items-center'>
            <div className='flex-1 max-w-24'>
              <Button type="submit" className={buttonClass}>Submit</Button>
            </div>
            <div className='flex-1'>
              {pictureUploading && <div className='flex items-center'><Loader size="small"/><span className='ml-3'>Image upload in progress...</span></div>}
              {postInProgress && <div className='flex items-center'><Loader size="small"/><span className='ml-3'>Sending data to server...</span></div>}
            </div>
          </div>
        </form>
      </Form>
    </div >
  );
}
