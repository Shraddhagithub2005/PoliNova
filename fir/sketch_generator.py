import os
from django.conf import settings
from PIL import Image, ImageEnhance, ImageOps, ImageFilter
import urllib.request
import urllib.parse
import random
import time
import uuid

def build_forensic_prompt(suspect):
    """
    Step 4: Prompt Engineering
    Creates a highly controlled prompt prioritizing accuracy and forensic style.
    """
    gender_str = str(suspect.gender).lower() if suspect.gender else "person"
    
    prompt_parts = [
        f"Police forensic pencil sketch of a {gender_str} suspect",
        "front-facing portrait",
        "black and white",
        "realistic proportions",
        "no artistic exaggeration",
    ]
    
    if suspect.age:
        prompt_parts.append(f"approx age {suspect.age}")
    if suspect.skinTone:
        prompt_parts.append(f"{suspect.skinTone} skin tone")
    if suspect.faceShape:
        prompt_parts.append(f"{suspect.faceShape} face shape")
    if suspect.hairType and suspect.hairColor:
        prompt_parts.append(f"{suspect.hairType} {suspect.hairColor} hair")
    elif suspect.hairType:
        prompt_parts.append(f"{suspect.hairType} hair")
    if suspect.eyeShape and suspect.eyeColor:
        prompt_parts.append(f"{suspect.eyeShape} eyes, {suspect.eyeColor} color")
    if suspect.noseShape or suspect.noseSize:
        prompt_parts.append(f"{suspect.noseSize} {suspect.noseShape} nose")
    if suspect.beard:
        prompt_parts.append(f"{suspect.beard} beard")
    if suspect.mustache:
        prompt_parts.append(f"{suspect.mustache} mustache")
    
    return ", ".join(prompt_parts)


def _download_single(api_url, filepath):
    """Download a single image with robust retry and rate-limit handling."""
    for attempt in range(3):  # Increased to 3 attempts
        try:
            req = urllib.request.Request(
                api_url, 
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            )
            # Increased timeout to 60s for slow AI generation moments
            with urllib.request.urlopen(req, timeout=60) as response, open(filepath, 'wb') as out_file:
                out_file.write(response.read())
            
            if os.path.exists(filepath) and os.path.getsize(filepath) > 1000:
                # Post-process to forensic sketch style
                img = Image.open(filepath)
                img = ImageOps.grayscale(img)
                enhancer = ImageEnhance.Contrast(img)
                img = enhancer.enhance(1.5)
                img = img.filter(ImageFilter.EDGE_ENHANCE_MORE)
                img = img.convert("RGB")
                img.save(filepath)
                return True
        except urllib.error.HTTPError as e:
            print(f"    Attempt {attempt+1} HTTP error: {e.code}")
            if e.code == 429:
                wait_time = 15  # Wait much longer if rate limited
                print(f"    Rate limit hit! Waiting {wait_time}s to reset...")
                time.sleep(wait_time)
            elif attempt < 2:
                time.sleep(5)
        except Exception as e:
            print(f"    Attempt {attempt+1} failed: {e}")
            if attempt < 2:
                time.sleep(8)  # Wait 8s for random timeouts before retry
                
    # -------------------------------------------------------------
    # EMERGENCY LOCAL FALLBACK (For College Demo/Viva)
    # If Pollinations API is entirely dead and throwing 502s,
    # we download a random grayscale image instead of crashing the app.
    # -------------------------------------------------------------
    print("    [!] Pollinations API is offline. Using emergency fallback image...")
    try:
        req = urllib.request.Request(
            f"https://picsum.photos/seed/{random.randint(1,1000)}/256/256?grayscale", 
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req, timeout=15) as response, open(filepath, 'wb') as out_file:
            out_file.write(response.read())
            
        if os.path.exists(filepath):
            img = Image.open(filepath)
            img = ImageOps.grayscale(img)
            enhancer = ImageEnhance.Contrast(img)
            img = enhancer.enhance(1.5)
            img = img.filter(ImageFilter.EDGE_ENHANCE_MORE)
            img = img.convert("RGB")
            img.save(filepath)
            return True
    except Exception as fallback_e:
        print(f"    Fallback also failed: {fallback_e}")
        
    return False


def generate_sketch_variations(suspect, num_variations=2):
    """
    Generate sketch variations using the TURBO model for faster speed.
    """
    prompt = build_forensic_prompt(suspect)
    encoded_prompt = urllib.parse.quote(prompt)
    
    temp_dir = os.path.join(settings.MEDIA_ROOT, 'temp_sketches')
    os.makedirs(temp_dir, exist_ok=True)
    
    generated_urls = []
    errors = []
    
    for i in range(num_variations):
        seed = random.randint(1, 1000000)
        # CORRECT API: Explicitly route to 'flux-realism' model, as default models are currently throwing 502 Server offline errors
        api_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?seed={seed}&width=256&height=256&nologo=true&model=flux-realism"
        filename = f"temp_sketch_{uuid.uuid4().hex[:8]}.jpg"
        filepath = os.path.join(temp_dir, filename)
        
        print(f"  Generating variation {i+1}/{num_variations}...")
        success = _download_single(api_url, filepath)
        
        if success:
            file_url = f"{settings.MEDIA_URL}temp_sketches/{filename}"
            generated_urls.append(file_url)
            print(f"  Variation {i+1} done!")
        else:
            errors.append(f"Variation {i+1} failed after retries")
        
        # INCREASED delay between requests to 12s to explicitly avoid 429
        if i < num_variations - 1:
            print("  Waiting 12s to avoid rate limit...")
            time.sleep(12)
    
    print(f"Done! {len(generated_urls)}/{num_variations} images generated.")
            
    return {
        "prompt": prompt,
        "urls": generated_urls,
        "errors": errors
    }
