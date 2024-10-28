import { Request, Response } from 'express';
import { Minsite } from '../models/Minsite'; // Ensure this path is correct based on your project structure

interface AuthRequest extends Request {
  user?: {
    id: number;
    // Add other user properties as needed
  };
}

export const saveMinsite = async (req: AuthRequest, res: Response) => {
  const { title, content, template, customCSS, seoMetadata, components } = req.body;

  if (!title || !content || !template) {
    return res.status(400).json({ error: 'Title, content, and template are required.' });
  }

  try {
    const newMinsite = await Minsite.create({
      title,
      content,
      userId: req.user.id,
      template,
      customCSS,
      seoMetadata,
      components,
      versions: [{ content, title, template, customCSS, seoMetadata, components, timestamp: new Date().toISOString() }],
    });
    res.status(201).json({ message: 'Minsite created successfully.', minsite: newMinsite });
  } catch (error) {
    console.error('Error saving minsite:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getMinsite = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const minsite = await Minsite.findOne({ where: { id, userId } });
    if (!minsite) {
      return res.status(404).json({ message: 'Minsite not found.' });
    }
    res.json(minsite);
  } catch (error) {
    console.error('Error fetching minsite:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateMinsite = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const { title, content, template, customCSS, seoMetadata, components } = req.body;

  try {
    const minsite = await Minsite.findOne({ where: { id, userId } });
    if (!minsite) {
      return res.status(404).json({ message: 'Minsite not found.' });
    }

    // Update minsite
    await minsite.update({
      title,
      content,
      template,
      customCSS,
      seoMetadata,
      components,
    });

    // Add new version to history
    const newVersion = {
      content,
      title,
      template,
      customCSS,
      seoMetadata,
      components,
      timestamp: new Date().toISOString(),
    };
    await minsite.update({
      versions: [...minsite.versions, newVersion],
    });

    res.json({ message: 'Minsite updated successfully.', minsite });
  } catch (error) {
    console.error('Error updating minsite:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const publishMinsite = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const minsite = await Minsite.findOne({ where: { id, userId } });
    if (!minsite) {
      return res.status(404).json({ message: 'Minsite not found.' });
    }

    // Generate a unique slug for the published minsite
    const slug = generateSlug(minsite.title);

    // Update the minsite with the published status and slug
    await minsite.update({
      isPublished: true,
      publishedSlug: slug,
    });

    const publishedUrl = `${process.env.BASE_URL}/m/${slug}`;

    res.json({ message: 'Minsite published successfully.', publishedUrl });
  } catch (error) {
    console.error('Error publishing minsite:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Helper function to generate a slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
    + '-' + Math.random().toString(36).substring(2, 7);
};
