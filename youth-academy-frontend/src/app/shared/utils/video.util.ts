/** يحول رابط يوتيوب عادي (watch / youtu.be / shorts) لرابط embed قابل للعرض في iframe */
export function getEmbedUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // تنظيف الرابط من أي مسافات زائدة
  url = url.trim();

  // 1️⃣ حل المشكلة الرئيسية: إذا كان الرابط يحتوي بالفعل على embed/، مرره فوراً دون تعديل
  if (url.includes('youtube.com/embed/') || url.includes('www.youtube.com/embed/')) {
    return url;
  }

  let videoId = '';

  try {
    if (url.includes('shorts/')) {
      const parts = url.split('shorts/')[1];
      if (parts) videoId = parts.split('?')[0].trim();
    } else if (url.includes('youtu.be/')) {
      const parts = url.split('youtu.be/')[1];
      if (parts) videoId = parts.split('?')[0].trim();
    } else if (url.includes('v=')) {
      const parts = url.split('v=')[1];
      if (parts) videoId = parts.split('&')[0].trim();
    }
  } catch (e) {
    console.error('Error parsing video URL:', e);
  }

  // إذا استخرج الـ videoId بنجاح يبني رابط الـ embed، وإلا يعود بالرابط الأصلي كحماية
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}
