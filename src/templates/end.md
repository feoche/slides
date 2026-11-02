---
layout: end
# feedback QR code below (`qr:<url>` or an image), overridable on the `src:` slide
qrCode: qr:https://francoiseoche.fr
image: https://francoiseoche.fr/assets/avatar.webp
hideInToc: true
---

::main::
<ul>
    <li>
        <h5 class="inline">Website :</h5>&nbsp;
        <a href="https://francoiseoche.fr/"
           target="_blank"
           aria-label="Site web de {{ $slidev.configs.author }} - Ouvre dans un nouvel onglet">
            francoiseoche.fr
        </a>
    </li>
    <li>
        <h5 class="inline">LinkedIn :</h5>&nbsp;
        <a href="https://www.linkedin.com/in/feoche/"
           target="_blank"
           aria-label="Profil LinkedIn - Ouvre dans un nouvel onglet">
            in/feoche
        </a>
    </li>
    <li>
        <h5 class="inline">Github :</h5>&nbsp;
        <a href="https://github.com/feoche"
           target="_blank"
           aria-label="Profil Github - Ouvre dans un nouvel onglet">
            @feoche
        </a>
    </li>
    <li>
        <h5 class="inline">X :</h5>&nbsp;
        <a href="https://x.com/francoiseoche"
           target="_blank"
           aria-label="Profil X - Ouvre dans un nouvel onglet">
            @francoiseoche
        </a>
    </li>
</ul>

::feedback::
<span class="flex place-items-center h-full">
<small class="mx-auto text-6xl fw-600">Merci !</small>
</span>

::qr-code::
##### Feedback :

<MediaEl :src="$frontmatter.qrCode"/>

<!-- Speaker Notes -->
