
# NaijaRizz - Product Requirements Document

## Overview
NaijaRizz is a mobile application that helps Nigerian users improve their dating and social messaging game with culturally relevant pickup lines, conversation starters, and chat assistance. The app analyzes screenshots of conversations or dating profiles and provides personalized suggestions for engaging responses with authentic Nigerian flavor.

## Target Audience
- Nigerian young adults (18-35)
- Dating app users (Tinder, Bumble, etc.)
- Social media users looking to improve their messaging skills
- Anyone wanting to enhance their "rizz" (charisma in conversations)

## Core Features

### 1. Screenshot Analysis ✅
- Upload screenshots of dating profiles or conversations
- OCR technology to extract text from images
- AI analysis of conversation context and tone
- Generation of Nigerian-style flirty responses
- Responses incorporate local slang, expressions, and cultural references

### 2. Manual Text Entry ✅
- Alternative to screenshot upload
- Users can manually type conversation details in separate fields:
  - "Their Reply" - What the other person said
  - "My Reply" (optional) - What you've already said
  - Focus Words (optional) - Specific topics to emphasize
- Supports direct copy-paste from messaging apps
- Multiple response styles: Genuine, NSFW, and Classic
- Language toggle between Standard English and Nigerian Pidgin
- Receives personalized AI-generated response suggestions

### 3. Pickup Lines Generator ✅
- Curated collection of Nigerian-style pickup lines
- Categorized by style (funny, romantic, clever)
- Culturally relevant and localized content
- Incorporates Nigerian slang and expressions

### 4. Navigation ✅
- Bottom tab navigation for mobile users
- Desktop navigation in header
- Mobile drawer menu with sharing options and contact links

### 5. Social Sharing ✅
- Share app with friends functionality
- Social media links to official NaijaRizz accounts
- Email contact option

### 6. Improved Features (Planned)
- Advanced conversation starters and responses
- Premium content focused on maintaining engaging conversations
- Situation-specific suggestions
- Expanded Nigerian slang and expression database

## Technical Implementation Status

### Completed ✅
- Core application architecture and UI design
- Screenshot analysis with OCR text extraction
- Manual text entry with context-aware fields
- Language toggle between English and Pidgin
- Response style selection (Genuine, NSFW, Classic)
- Integration with DeepSeek AI via Supabase Edge Functions
- Response generation with contextual awareness
- Mobile-responsive design with bottom navigation
- Rizz lines random generator
- Mobile drawer menu with social sharing
- Navigation system for both mobile and desktop

### In Progress 🚧
- User accounts and saved responses
- Expanded Nigerian slang and expression database
- UI/UX improvements and animations

### Future Development 📋
- User accounts and saved responses
- Advanced AI analysis with sentiment detection
- Premium subscription model
- Expanded content categories
- Regional dialect support for different Nigerian regions

## User Flows

### Primary Flow - Screenshot Analysis
1. User uploads a screenshot of a conversation or profile
2. App processes the image and extracts relevant text using OCR
3. Text is analyzed for context and conversation type
4. App generates personalized Nigerian-style response suggestions
5. User can copy suggestions to clipboard for use in their conversations

### Secondary Flow - Manual Entry
1. User enters text manually using three distinct input fields:
   - "Their Reply" (required) - The message they received
   - "My Reply" (optional) - Their previous response
   - Focus Words (optional) - Topics to emphasize
2. User selects preferred language (English or Pidgin)
3. User chooses response style (Genuine, NSFW, or Classic)
4. AI analyzes the content and context
5. App generates personalized response suggestions matching the selected style and language
6. User can copy and customize suggestions

## Design Implementation

### Current Design Elements ✅
- Mobile-first responsive design
- Brand colors implemented (black, white, gradient backgrounds)
- Bottom navigation for mobile users
- Top navigation for desktop users
- Mobile drawer menu with social features
- Card-based design for content organization
- Modal displays for response suggestions

### Constraints & Considerations
- Privacy concerns with uploaded conversations
- Cultural sensitivity in suggestions
- Moderation of user-generated content
- Performance on low-end devices
- Accuracy of OCR in various lighting conditions

## Next Steps
1. Complete user account implementation
2. Expand Nigerian cultural content
3. Implement analytics to improve suggestion quality
4. Develop premium subscription features
5. Enhance UI/UX with more animations and transitions
