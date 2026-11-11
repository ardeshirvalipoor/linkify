(() => {
  // Keep each locale's copy in this key order so shared page markup stays lightweight.
  const keys = [
    "Linkify home", "Main navigation", "How it works", "About", "Terms", "Privacy", "Language",
    "About Linkify", "Big files. Less fuss.",
    "Linkify makes it easy to send a file without creating an account or wrestling with email attachment limits. Upload it, choose how long the link should work, and share it with the people who need it.",
    "Made for sharing, not setup",
    "Files up to 1 GB upload directly from your browser to private storage. If your connection drops, you can continue in the same browser by choosing the same file again. When the upload finishes, share the generated link and let Linkify handle the expiration.",
    "A few thoughtful extras", "Send up to 1 GB", "Share large files that are awkward to attach to a message.",
    "Resume an upload", "Pick up an interrupted transfer in the same browser for up to 7 days.",
    "No account needed", "Start sharing right away, without a signup or profile to manage.",
    "Choose link lifetime", "Set the link to expire one hour, one day, or one week after upload.",
    "Optional password check", "Add another access check. Password protection is not file encryption.",
    "Private storage", "Files are not published as public objects; access is requested through a share link.", "Share a file",
    "A quick guide", "From file to shared link.",
    "Choose a file, set a few options, and share one link. No account or email attachment required.",
    "Three simple steps", "01 / Choose", "Select a file up to 1 GB. You can drag it onto the upload area or browse for it.",
    "02 / Set access", "Choose an expiration time and, if you want, add a password check for the link.",
    "03 / Share", "When the upload completes, copy the link and send it to your recipient.",
    "Frequently asked questions", "How do I send large files?",
    "What if my upload gets interrupted?", "Return in the same browser profile and choose the same file again within 7 days. Linkify can continue an upload while its saved browser data and the incomplete storage parts are still available.",
    "Do I need an account?", "No. You can upload and create a share link without signing up.",
    "Can I add a password?", "Yes. Turn on password protection before uploading and choose a password. It checks access to the file but does not encrypt the file, so share the password separately from the link.",
    "How long does a share link last?",
    "Choose one hour, one day, or one week. The countdown begins after the upload completes. Linkify stops accepting the share link at expiry; a storage URL already issued may remain usable for up to five minutes.",
    "Can a link be used to download the file?", "Yes. Anyone with the link can open it while it is valid. If you enabled password protection, they will also need the password.",
    "Start sharing",
    "Linkify / Privacy", "Privacy Policy",
    "Uploaded files are held in a private Cloudflare R2 bucket, not published as public objects. A signed share link is required to request access through Linkify.",
    "Password protection",
    "A password is an access check, not encryption. Passwords must be 6 to 128 characters. Linkify checks it before issuing a short-lived storage URL; the file itself is not end-to-end encrypted. The password is not embedded in the share link. The database stores an HMAC-SHA-256 keyed hash of the password, not its plain text, and Linkify handles the password when checking it. Share the password separately from the link and choose a unique, hard-to-guess password.",
    "Once Linkify has issued a direct storage URL, that URL can be used without entering the password again until it expires, no later than five minutes after issue. Revoking a link or changing its status cannot recall a URL already issued or a file someone has downloaded.",
    "Automatic expiration",
    "The selected 1-hour, 1-day, or 1-week lifetime starts only after the upload completes successfully. At the deadline, Linkify stops accepting the share link. The object is deleted by a cleanup job that runs while the service is awake; if the service has stopped while idle, physical deletion waits until it starts again. Thus, link access expires on schedule, but storage removal may happen later.",
    "An interrupted upload can resume for up to 7 days in the same browser profile if its site data is retained and you choose the same file again. Incomplete parts are removed by the configured storage lifecycle rule after that period.",
    "Information we retain",
    "We do not store file contents in the database. We keep file metadata there, including the file identifier, name, content type, size, upload status, timestamps, expiration time, password hash when set, and download count. The file itself is deleted from storage after its link expires and the cleanup job runs.",
    "Each download is logged with the file identifier, time, a keyed hash of the visitor's IP address, and the browser's user-agent string. These download logs and file metadata remain in the database unless they are manually removed.",
    "Because file-sharing services handle user content, you are responsible for the information you upload and share. Please do not upload personal data or sensitive documents unless you intend to share them via the selected protected link.",
    "Back to the app",
    "Linkify / Terms", "Terms of Service",
    "Linkify lets you upload files, generate private share links, and optionally protect those links with a password.",
    "You are responsible for the files you upload and for the people you share them with. Do not upload content that violates the law, infringes on other people's rights, or contains malware or abusive material.",
    "We provide the service as-is and may suspend or remove links that abuse the platform, contain harmful content, or interfere with normal operation.",
    "Files are stored in a private object-storage bucket. Password protection is an access check, not encryption: the service checks the password before issuing a direct storage URL that remains usable for up to five minutes. Keep share links and passwords private, and share passwords separately from their links.",
    "The selected link lifetime begins when the upload completes. Link access is rejected at expiry, while removal of the stored object may happen later when the cleanup job runs.",
    "For each upload, we keep the file name, content type, size, file identifier, status, upload/completion timestamps, link expiration time, and password hash when set in our database. File metadata may remain in the database after the stored file is removed.",
    "When someone downloads a file, we record the file identifier, download time, a keyed hash of the visitor's IP address, and their browser user-agent string. Download records and file metadata are retained in the database. Passwords themselves are not stored, but a hash is kept to verify protected links.",
    "By using Linkify, you agree to these terms and to any applicable local or regional laws governing file sharing and online services."
  ];

  const localized = {
    es: [
      "Inicio de Linkify", "Navegación principal", "Cómo funciona", "Acerca de", "Términos", "Privacidad", "Idioma",
      "Acerca de Linkify", "Archivos grandes. Sin complicaciones.",
      "Linkify facilita enviar archivos sin crear una cuenta ni lidiar con los límites de los archivos adjuntos del correo. Súbelo, elige cuánto tiempo funcionará el enlace y compártelo con quien lo necesite.",
      "Hecho para compartir, no para configurar",
      "Los archivos de hasta 1 GB se cargan directamente desde tu navegador a un almacenamiento privado. Si se interrumpe la conexión, puedes continuar en el mismo navegador seleccionando de nuevo el mismo archivo. Al terminar la carga, comparte el enlace generado y Linkify se encargará de que caduque.",
      "Algunos detalles útiles", "Envía hasta 1 GB", "Comparte archivos grandes que sería difícil adjuntar a un mensaje.",
      "Reanuda una carga", "Continúa una transferencia interrumpida en el mismo navegador durante un máximo de 7 días.",
      "No necesitas una cuenta", "Empieza a compartir de inmediato, sin registrarte ni administrar un perfil.",
      "Elige la duración del enlace", "Configura el enlace para que caduque una hora, un día o una semana después de la carga.",
      "Contraseña opcional", "Añade una comprobación de acceso. La protección con contraseña no cifra el archivo.",
      "Almacenamiento privado", "Los archivos no se publican como objetos públicos; se solicita acceso mediante un enlace para compartir.", "Compartir un archivo",
      "Guía rápida", "Del archivo al enlace compartido.",
      "Elige un archivo, configura algunas opciones y comparte un enlace. No necesitas una cuenta ni adjuntar archivos al correo.",
      "Tres pasos sencillos", "01 / Elegir", "Selecciona un archivo de hasta 1 GB. Puedes arrastrarlo al área de carga o buscarlo.",
      "02 / Configurar el acceso", "Elige cuándo caduca y, si quieres, añade una contraseña para el enlace.",
      "03 / Compartir", "Cuando termine la carga, copia el enlace y envíaselo a quien lo recibirá.",
      "Preguntas frecuentes", "¿Cómo envío archivos grandes?",
      "¿Qué pasa si se interrumpe la carga?", "Vuelve con el mismo perfil del navegador y selecciona de nuevo el mismo archivo antes de que pasen 7 días. Linkify puede continuar la carga mientras estén disponibles los datos guardados del navegador y las partes incompletas del almacenamiento.",
      "¿Necesito una cuenta?", "No. Puedes cargar archivos y crear un enlace para compartir sin registrarte.",
      "¿Puedo añadir una contraseña?", "Sí. Activa la protección con contraseña antes de cargar el archivo y elige una. La contraseña comprueba el acceso, pero no cifra el archivo; compártela por separado del enlace.",
      "¿Cuánto dura un enlace para compartir?",
      "Elige una hora, un día o una semana. La cuenta atrás empieza cuando termina la carga. Linkify deja de aceptar el enlace al caducar; una URL de almacenamiento ya emitida podría seguir funcionando hasta cinco minutos.",
      "¿Se puede usar el enlace para descargar el archivo?", "Sí. Cualquier persona que tenga el enlace puede abrirlo mientras sea válido. Si activaste la protección con contraseña, también necesitará la contraseña.",
      "Empieza a compartir",
      "Linkify / Privacidad", "Política de privacidad",
      "Los archivos cargados se guardan en un depósito privado de Cloudflare R2 y no se publican como objetos públicos. Se necesita un enlace firmado para solicitar acceso a través de Linkify.",
      "Protección con contraseña",
      "La contraseña comprueba el acceso, no cifra el archivo. Debe tener entre 6 y 128 caracteres. Linkify la comprueba antes de emitir una URL de almacenamiento de corta duración; el archivo no está cifrado de extremo a extremo. La contraseña no se incluye en el enlace. La base de datos guarda un hash HMAC-SHA-256 con clave, no el texto de la contraseña, y Linkify la procesa al comprobarla. Comparte la contraseña por separado del enlace y elige una única y difícil de adivinar.",
      "Una vez que Linkify emite una URL directa de almacenamiento, se puede usar sin volver a introducir la contraseña hasta que caduque, como máximo cinco minutos después de su emisión. Revocar un enlace o cambiar su estado no puede retirar una URL ya emitida ni un archivo que alguien haya descargado.",
      "Caducidad automática",
      "La duración elegida de 1 hora, 1 día o 1 semana empieza solo cuando la carga termina correctamente. Al llegar el plazo, Linkify deja de aceptar el enlace. Una tarea de limpieza elimina el objeto mientras el servicio está activo; si el servicio se detuvo mientras estaba inactivo, la eliminación física espera hasta que vuelva a iniciarse. Así, el acceso al enlace caduca a tiempo, pero el almacenamiento puede eliminarse más tarde.",
      "Una carga interrumpida puede reanudarse durante un máximo de 7 días en el mismo perfil del navegador si se conservan los datos del sitio y vuelves a elegir el mismo archivo. La regla configurada del ciclo de vida del almacenamiento elimina las partes incompletas después de ese plazo.",
      "Información que conservamos",
      "No guardamos el contenido de los archivos en la base de datos. Allí conservamos metadatos: identificador, nombre, tipo de contenido, tamaño, estado de carga, marcas de tiempo, fecha de caducidad, hash de contraseña si se configuró y número de descargas. El archivo se elimina del almacenamiento después de que caduque el enlace y se ejecute la limpieza.",
      "Cada descarga se registra con el identificador del archivo, la hora, un hash con clave de la dirección IP del visitante y la cadena de agente de usuario del navegador. Los registros de descarga y los metadatos permanecen en la base de datos salvo que se eliminen manualmente.",
      "Como los servicios para compartir archivos gestionan contenido de usuarios, eres responsable de la información que cargas y compartes. No cargues datos personales ni documentos sensibles salvo que quieras compartirlos mediante el enlace protegido que hayas elegido.",
      "Volver a la aplicación",
      "Linkify / Términos", "Términos del servicio",
      "Linkify te permite cargar archivos, generar enlaces privados para compartir y, si quieres, protegerlos con una contraseña.",
      "Eres responsable de los archivos que cargas y de las personas con quienes los compartes. No cargues contenido ilegal, que infrinja los derechos de otras personas o que incluya malware o material abusivo.",
      "Ofrecemos el servicio tal cual y podemos suspender o eliminar enlaces que hagan un uso abusivo de la plataforma, contengan contenido dañino o interfieran con su funcionamiento normal.",
      "Los archivos se guardan en un depósito privado de almacenamiento de objetos. La contraseña comprueba el acceso, no cifra el archivo: el servicio la verifica antes de emitir una URL directa de almacenamiento que funciona hasta cinco minutos. Mantén privados los enlaces y las contraseñas, y comparte las contraseñas por separado.",
      "La duración elegida del enlace empieza al terminar la carga. El acceso se rechaza al caducar, aunque el objeto almacenado puede eliminarse más tarde cuando se ejecute la tarea de limpieza.",
      "Para cada carga guardamos en la base de datos el nombre, tipo de contenido, tamaño, identificador, estado, marcas de tiempo de carga y finalización, fecha de caducidad y hash de contraseña si se configuró. Los metadatos pueden permanecer en la base de datos después de eliminar el archivo almacenado.",
      "Cuando alguien descarga un archivo, registramos su identificador, la hora de descarga, un hash con clave de la dirección IP del visitante y la cadena de agente de usuario de su navegador. Los registros de descarga y los metadatos se conservan en la base de datos. No guardamos las contraseñas, pero sí un hash para verificar los enlaces protegidos.",
      "Al usar Linkify, aceptas estos términos y las leyes locales o regionales aplicables al intercambio de archivos y los servicios en línea."
    ],
    fr: [
      "Accueil Linkify", "Navigation principale", "Comment ça marche", "À propos", "Conditions", "Confidentialité", "Langue",
      "À propos de Linkify", "Gros fichiers. Sans tracas.",
      "Linkify permet d’envoyer facilement un fichier sans créer de compte ni se soucier des limites des pièces jointes. Téléversez-le, choisissez la durée du lien, puis partagez-le avec les personnes concernées.",
      "Conçu pour partager, pas pour configurer",
      "Les fichiers jusqu’à 1 Go sont téléversés directement depuis votre navigateur vers un stockage privé. Si la connexion est interrompue, vous pouvez reprendre dans le même navigateur en sélectionnant à nouveau le même fichier. Une fois le téléversement terminé, partagez le lien généré et Linkify se charge de son expiration.",
      "Quelques options bien pensées", "Envoyer jusqu’à 1 Go", "Partagez les gros fichiers difficiles à joindre à un message.",
      "Reprendre un téléversement", "Reprenez un transfert interrompu dans le même navigateur pendant 7 jours maximum.",
      "Aucun compte requis", "Commencez à partager tout de suite, sans inscription ni profil à gérer.",
      "Choisir la durée du lien", "Faites expirer le lien une heure, un jour ou une semaine après le téléversement.",
      "Vérification par mot de passe facultative", "Ajoutez une vérification d’accès. La protection par mot de passe ne chiffre pas le fichier.",
      "Stockage privé", "Les fichiers ne sont pas publiés comme objets publics ; l’accès est demandé via un lien de partage.", "Partager un fichier",
      "Guide rapide", "Du fichier au lien partagé.",
      "Choisissez un fichier, réglez quelques options et partagez un lien. Aucun compte ni pièce jointe n’est nécessaire.",
      "Trois étapes simples", "01 / Choisir", "Sélectionnez un fichier jusqu’à 1 Go. Faites-le glisser dans la zone de téléversement ou recherchez-le.",
      "02 / Régler l’accès", "Choisissez une expiration et, si vous le souhaitez, ajoutez un mot de passe au lien.",
      "03 / Partager", "À la fin du téléversement, copiez le lien et envoyez-le à votre destinataire.",
      "Questions fréquentes", "Comment envoyer de gros fichiers ?",
      "Que faire si mon téléversement est interrompu ?", "Revenez dans le même profil de navigateur et sélectionnez à nouveau le même fichier dans les 7 jours. Linkify peut reprendre le téléversement tant que les données enregistrées du navigateur et les parties incomplètes stockées sont disponibles.",
      "Ai-je besoin d’un compte ?", "Non. Vous pouvez téléverser un fichier et créer un lien de partage sans vous inscrire.",
      "Puis-je ajouter un mot de passe ?", "Oui. Activez la protection par mot de passe avant le téléversement et choisissez un mot de passe. Il contrôle l’accès au fichier sans le chiffrer ; partagez-le séparément du lien.",
      "Combien de temps un lien de partage reste-t-il valide ?",
      "Choisissez une heure, un jour ou une semaine. Le compte à rebours commence à la fin du téléversement. Linkify cesse d’accepter le lien à son expiration ; une URL de stockage déjà émise peut rester utilisable jusqu’à cinq minutes.",
      "Un lien permet-il de télécharger le fichier ?", "Oui. Toute personne disposant du lien peut l’ouvrir tant qu’il est valide. Si la protection par mot de passe est activée, elle devra aussi connaître le mot de passe.",
      "Commencer à partager",
      "Linkify / Confidentialité", "Politique de confidentialité",
      "Les fichiers téléversés sont conservés dans un compartiment Cloudflare R2 privé et ne sont pas publiés comme objets publics. Un lien de partage signé est nécessaire pour demander l’accès via Linkify.",
      "Protection par mot de passe",
      "Un mot de passe contrôle l’accès, il ne chiffre pas le fichier. Il doit comporter de 6 à 128 caractères. Linkify le vérifie avant d’émettre une URL de stockage de courte durée ; le fichier n’est pas chiffré de bout en bout. Le mot de passe n’est pas intégré au lien. La base de données stocke un hachage HMAC-SHA-256 avec clé, et non le texte brut, et Linkify traite le mot de passe lors de sa vérification. Partagez-le séparément du lien et choisissez-en un unique et difficile à deviner.",
      "Après l’émission d’une URL de stockage directe par Linkify, elle peut être utilisée sans ressaisir le mot de passe jusqu’à son expiration, au plus tard cinq minutes après son émission. Révoquer un lien ou modifier son état ne peut pas annuler une URL déjà émise ni un fichier déjà téléchargé.",
      "Expiration automatique",
      "La durée choisie — 1 heure, 1 jour ou 1 semaine — commence uniquement lorsque le téléversement est terminé. À l’échéance, Linkify cesse d’accepter le lien. Une tâche de nettoyage supprime l’objet lorsque le service est actif ; si le service s’est arrêté pendant une période d’inactivité, la suppression physique attend son prochain démarrage. L’accès expire donc à l’heure prévue, mais la suppression du stockage peut être ultérieure.",
      "Un téléversement interrompu peut être repris pendant 7 jours maximum dans le même profil de navigateur si les données du site sont conservées et que vous sélectionnez à nouveau le même fichier. La règle de cycle de vie configurée supprime les parties incomplètes après cette période.",
      "Informations conservées",
      "Nous ne stockons pas le contenu des fichiers dans la base de données. Nous y conservons leurs métadonnées : identifiant, nom, type de contenu, taille, état du téléversement, horodatages, expiration, hachage du mot de passe le cas échéant et nombre de téléchargements. Le fichier est supprimé du stockage après l’expiration du lien et l’exécution du nettoyage.",
      "Chaque téléchargement est enregistré avec l’identifiant du fichier, l’heure, un hachage avec clé de l’adresse IP du visiteur et la chaîne user-agent du navigateur. Ces journaux et les métadonnées restent dans la base de données sauf suppression manuelle.",
      "Les services de partage traitant du contenu utilisateur, vous êtes responsable des informations téléversées et partagées. Ne téléversez pas de données personnelles ni de documents sensibles, sauf si vous souhaitez les partager via le lien protégé choisi.",
      "Retour à l’application",
      "Linkify / Conditions", "Conditions d’utilisation",
      "Linkify vous permet de téléverser des fichiers, de créer des liens privés et, en option, de les protéger par mot de passe.",
      "Vous êtes responsable des fichiers téléversés et des personnes avec qui vous les partagez. Ne téléversez aucun contenu illégal, portant atteinte aux droits d’autrui, contenant un logiciel malveillant ou un contenu abusif.",
      "Le service est fourni en l’état. Nous pouvons suspendre ou supprimer les liens qui abusent de la plateforme, contiennent du contenu nuisible ou perturbent son fonctionnement normal.",
      "Les fichiers sont stockés dans un compartiment privé de stockage d’objets. La protection par mot de passe contrôle l’accès, elle ne chiffre pas le fichier : le service vérifie le mot de passe avant d’émettre une URL directe de stockage, utilisable jusqu’à cinq minutes. Gardez les liens et mots de passe privés et partagez les mots de passe séparément.",
      "La durée choisie commence à la fin du téléversement. L’accès au lien est refusé à son expiration, mais l’objet stocké peut être supprimé ultérieurement lors du nettoyage.",
      "Pour chaque téléversement, nous conservons dans la base de données le nom, le type de contenu, la taille, l’identifiant, l’état, les horodatages de téléversement et de fin, l’expiration du lien et le hachage du mot de passe le cas échéant. Les métadonnées peuvent rester après la suppression du fichier stocké.",
      "Lors d’un téléchargement, nous enregistrons l’identifiant du fichier, l’heure, un hachage avec clé de l’adresse IP du visiteur et sa chaîne user-agent. Les journaux et métadonnées sont conservés dans la base de données. Les mots de passe ne sont pas stockés, mais leur hachage sert à vérifier les liens protégés.",
      "En utilisant Linkify, vous acceptez ces conditions ainsi que les lois locales ou régionales applicables au partage de fichiers et aux services en ligne."
    ],
    de: [
      "Linkify-Startseite", "Hauptnavigation", "So funktioniert es", "Über uns", "Bedingungen", "Datenschutz", "Sprache",
      "Über Linkify", "Große Dateien. Ganz einfach.",
      "Mit Linkify versenden Sie Dateien ganz einfach, ohne ein Konto anzulegen oder sich um E-Mail-Anhangsgrenzen zu kümmern. Laden Sie die Datei hoch, wählen Sie die Gültigkeitsdauer des Links und teilen Sie ihn mit den gewünschten Personen.",
      "Zum Teilen gemacht, nicht zum Einrichten",
      "Dateien bis zu 1 GB werden direkt aus Ihrem Browser in einen privaten Speicher hochgeladen. Wird die Verbindung unterbrochen, können Sie im selben Browser fortfahren, indem Sie dieselbe Datei erneut auswählen. Teilen Sie nach dem Upload den erzeugten Link; Linkify kümmert sich um den Ablauf.",
      "Praktische Extras", "Bis zu 1 GB senden", "Teilen Sie große Dateien, die sich nur schwer an eine Nachricht anhängen lassen.",
      "Upload fortsetzen", "Setzen Sie eine unterbrochene Übertragung im selben Browser bis zu 7 Tage lang fort.",
      "Kein Konto erforderlich", "Teilen Sie sofort los, ohne Registrierung oder Profilverwaltung.",
      "Linkgültigkeit wählen", "Lassen Sie den Link eine Stunde, einen Tag oder eine Woche nach dem Upload ablaufen.",
      "Optionaler Passwortschutz", "Fügen Sie eine Zugriffskontrolle hinzu. Passwortschutz ist keine Dateiverschlüsselung.",
      "Privater Speicher", "Dateien werden nicht als öffentliche Objekte veröffentlicht; der Zugriff erfolgt über einen Freigabelink.", "Datei teilen",
      "Kurzanleitung", "Von der Datei zum Freigabelink.",
      "Wählen Sie eine Datei und einige Optionen aus und teilen Sie einen Link. Konto und E-Mail-Anhang sind nicht erforderlich.",
      "Drei einfache Schritte", "01 / Auswählen", "Wählen Sie eine Datei bis 1 GB aus. Ziehen Sie sie in den Upload-Bereich oder suchen Sie sie dort.",
      "02 / Zugriff festlegen", "Wählen Sie den Ablaufzeitpunkt und fügen Sie bei Bedarf einen Passwortschutz hinzu.",
      "03 / Teilen", "Kopieren Sie nach dem Upload den Link und senden Sie ihn an den Empfänger.",
      "Häufig gestellte Fragen", "Wie sende ich große Dateien?",
      "Was passiert bei einem unterbrochenen Upload?", "Kehren Sie im selben Browserprofil zurück und wählen Sie innerhalb von 7 Tagen dieselbe Datei erneut aus. Linkify kann den Upload fortsetzen, solange die gespeicherten Browserdaten und die unvollständigen Speicherteile verfügbar sind.",
      "Brauche ich ein Konto?", "Nein. Sie können Dateien hochladen und einen Freigabelink erstellen, ohne sich anzumelden.",
      "Kann ich ein Passwort hinzufügen?", "Ja. Aktivieren Sie vor dem Upload den Passwortschutz und wählen Sie ein Passwort. Es prüft den Dateizugriff, verschlüsselt die Datei aber nicht. Teilen Sie das Passwort getrennt vom Link.",
      "Wie lange ist ein Freigabelink gültig?",
      "Wählen Sie eine Stunde, einen Tag oder eine Woche. Der Countdown beginnt nach dem Upload. Nach Ablauf akzeptiert Linkify den Freigabelink nicht mehr; eine bereits ausgegebene Speicher-URL kann bis zu fünf Minuten nutzbar bleiben.",
      "Kann man über einen Link die Datei herunterladen?", "Ja. Jeder mit dem Link kann ihn öffnen, solange er gültig ist. Bei aktiviertem Passwortschutz wird zusätzlich das Passwort benötigt.",
      "Jetzt teilen",
      "Linkify / Datenschutz", "Datenschutzerklärung",
      "Hochgeladene Dateien liegen in einem privaten Cloudflare-R2-Bucket und werden nicht als öffentliche Objekte veröffentlicht. Für den Zugriff über Linkify ist ein signierter Freigabelink erforderlich.",
      "Passwortschutz",
      "Ein Passwort kontrolliert den Zugriff, es verschlüsselt die Datei nicht. Passwörter müssen 6 bis 128 Zeichen lang sein. Linkify prüft es vor der Ausgabe einer kurzlebigen Speicher-URL; die Datei ist nicht Ende-zu-Ende-verschlüsselt. Das Passwort ist nicht im Freigabelink enthalten. Die Datenbank speichert einen schlüsselgebundenen HMAC-SHA-256-Hash statt des Klartexts; Linkify verarbeitet das Passwort bei der Prüfung. Teilen Sie es getrennt vom Link und wählen Sie ein einmaliges, schwer zu erratendes Passwort.",
      "Nach der Ausgabe einer direkten Speicher-URL durch Linkify kann sie bis zum Ablauf ohne erneute Passworteingabe verwendet werden, höchstens fünf Minuten nach der Ausgabe. Das Widerrufen eines Links oder Ändern seines Status kann eine bereits ausgegebene URL oder heruntergeladene Datei nicht zurückrufen.",
      "Automatischer Ablauf",
      "Die gewählte Gültigkeitsdauer von 1 Stunde, 1 Tag oder 1 Woche beginnt erst nach erfolgreichem Upload. Zum Ablaufzeitpunkt akzeptiert Linkify den Freigabelink nicht mehr. Ein Bereinigungsauftrag löscht das Objekt, solange der Dienst aktiv ist; war der Dienst im Leerlauf beendet, erfolgt die physische Löschung erst nach seinem nächsten Start. Der Linkzugriff endet also planmäßig, die Speicherlöschung kann später erfolgen.",
      "Ein unterbrochener Upload kann bis zu 7 Tage im selben Browserprofil fortgesetzt werden, sofern die Websitedaten erhalten bleiben und Sie dieselbe Datei erneut auswählen. Unvollständige Teile werden danach durch die konfigurierte Speicher-Lebenszyklusregel entfernt.",
      "Gespeicherte Informationen",
      "Dateiinhalte speichern wir nicht in der Datenbank. Dort speichern wir Metadaten wie Datei-ID, Name, Inhaltstyp, Größe, Uploadstatus, Zeitstempel, Ablaufzeit, gegebenenfalls Passwort-Hash und Downloadanzahl. Die Datei wird nach Ablauf ihres Links und Ausführung der Bereinigung aus dem Speicher gelöscht.",
      "Jeder Download wird mit Datei-ID, Zeitpunkt, einem schlüsselgebundenen Hash der IP-Adresse des Besuchers und dem User-Agent-String des Browsers protokolliert. Downloadprotokolle und Dateimetadaten bleiben in der Datenbank, sofern sie nicht manuell entfernt werden.",
      "Da Dateifreigabedienste Nutzerinhalte verarbeiten, sind Sie für die hochgeladenen und geteilten Informationen verantwortlich. Laden Sie keine personenbezogenen Daten oder vertraulichen Dokumente hoch, es sei denn, Sie möchten sie über den gewählten geschützten Link teilen.",
      "Zurück zur App",
      "Linkify / Bedingungen", "Nutzungsbedingungen",
      "Mit Linkify können Sie Dateien hochladen, private Freigabelinks erstellen und diese optional mit einem Passwort schützen.",
      "Sie sind für die hochgeladenen Dateien und die Personen verantwortlich, mit denen Sie sie teilen. Laden Sie keine rechtswidrigen, die Rechte anderer verletzenden oder Malware beziehungsweise missbräuchliche Inhalte enthaltenden Dateien hoch.",
      "Wir stellen den Dienst wie besehen bereit und können Links sperren oder entfernen, die die Plattform missbrauchen, schädliche Inhalte enthalten oder den normalen Betrieb stören.",
      "Dateien werden in einem privaten Objektspeicher-Bucket abgelegt. Passwortschutz kontrolliert den Zugriff, verschlüsselt die Datei aber nicht: Vor Ausgabe einer direkten Speicher-URL, die bis zu fünf Minuten nutzbar bleibt, prüft der Dienst das Passwort. Halten Sie Links und Passwörter geheim und teilen Sie Passwörter getrennt von den Links.",
      "Die gewählte Linkgültigkeit beginnt nach Abschluss des Uploads. Der Zugriff wird nach Ablauf abgelehnt; das gespeicherte Objekt kann später durch den Bereinigungsauftrag entfernt werden.",
      "Für jeden Upload speichern wir Dateiname, Inhaltstyp, Größe, Datei-ID, Status, Upload-/Abschlusszeitpunkte, Linkablauf und gegebenenfalls den Passwort-Hash in der Datenbank. Dateimetadaten können nach dem Entfernen der gespeicherten Datei erhalten bleiben.",
      "Beim Download speichern wir Datei-ID, Downloadzeitpunkt, einen schlüsselgebundenen Hash der IP-Adresse des Besuchers und den User-Agent-String des Browsers. Downloadaufzeichnungen und Dateimetadaten bleiben in der Datenbank. Passwörter selbst speichern wir nicht, aber einen Hash zur Prüfung geschützter Links.",
      "Mit der Nutzung von Linkify stimmen Sie diesen Bedingungen und allen geltenden lokalen oder regionalen Gesetzen zu Dateiübertragungen und Online-Diensten zu."
    ],
    ar: [
      "الصفحة الرئيسية لـ Linkify", "التنقل الرئيسي", "كيف يعمل", "حول", "الشروط", "الخصوصية", "اللغة",
      "حول Linkify", "ملفات كبيرة. بلا تعقيد.",
      "يسهّل Linkify إرسال الملفات دون إنشاء حساب أو التعامل مع حدود مرفقات البريد الإلكتروني. ارفع الملف، واختر مدة صلاحية الرابط، ثم شاركه مع من يحتاج إليه.",
      "مصمم للمشاركة، لا للإعداد",
      "تُرفع الملفات حتى 1 غيغابايت مباشرةً من متصفحك إلى مساحة تخزين خاصة. إذا انقطع الاتصال، يمكنك المتابعة في المتصفح نفسه باختيار الملف نفسه مجددًا. بعد اكتمال الرفع، شارك الرابط الذي أُنشئ ودع Linkify يتولى انتهاء صلاحيته.",
      "إضافات مفيدة", "أرسل حتى 1 غيغابايت", "شارك الملفات الكبيرة التي يصعب إرفاقها برسالة.",
      "استئناف الرفع", "تابع نقلًا منقطعًا في المتصفح نفسه لمدة تصل إلى 7 أيام.",
      "لا حاجة إلى حساب", "ابدأ المشاركة فورًا دون تسجيل أو إدارة ملف شخصي.",
      "اختر مدة الرابط", "اجعل الرابط ينتهي بعد ساعة أو يوم أو أسبوع من الرفع.",
      "التحقق بكلمة مرور اختياري", "أضف خطوة للتحقق من الوصول. الحماية بكلمة مرور ليست تشفيرًا للملف.",
      "تخزين خاص", "لا تُنشر الملفات كعناصر عامة؛ ويُطلب الوصول إليها عبر رابط مشاركة.", "شارك ملفًا",
      "دليل سريع", "من الملف إلى رابط المشاركة.",
      "اختر ملفًا واضبط بعض الخيارات وشارك رابطًا واحدًا. لا حاجة إلى حساب أو مرفق بريد إلكتروني.",
      "ثلاث خطوات بسيطة", "01 / اختر", "اختر ملفًا حتى 1 غيغابايت. اسحبه إلى منطقة الرفع أو استعرض الملفات.",
      "02 / إعداد الوصول", "اختر وقت انتهاء الصلاحية، وأضف كلمة مرور للرابط إن أردت.",
      "03 / شارك", "بعد اكتمال الرفع، انسخ الرابط وأرسله إلى المستلم.",
      "الأسئلة الشائعة", "كيف أرسل ملفات كبيرة؟",
      "ماذا لو انقطع الرفع؟", "عُد باستخدام ملف المتصفح الشخصي نفسه واختر الملف نفسه مجددًا خلال 7 أيام. يمكن لـ Linkify متابعة الرفع ما دامت بيانات المتصفح المحفوظة وأجزاء التخزين غير المكتملة متاحة.",
      "هل أحتاج إلى حساب؟", "لا. يمكنك رفع ملف وإنشاء رابط مشاركة دون التسجيل.",
      "هل يمكنني إضافة كلمة مرور؟", "نعم. فعّل الحماية بكلمة مرور قبل الرفع واختر كلمة مرور. تتحقق من الوصول إلى الملف لكنها لا تشفّره، لذا شارك كلمة المرور منفصلة عن الرابط.",
      "ما مدة صلاحية رابط المشاركة؟",
      "اختر ساعة أو يومًا أو أسبوعًا. يبدأ العد التنازلي بعد اكتمال الرفع. يتوقف Linkify عن قبول رابط المشاركة عند انتهاء صلاحيته؛ وقد يظل عنوان تخزين صدر بالفعل صالحًا لمدة تصل إلى خمس دقائق.",
      "هل يمكن استخدام الرابط لتنزيل الملف؟", "نعم. يمكن لأي شخص لديه الرابط فتحه ما دام صالحًا. وإذا فعّلت الحماية بكلمة مرور، فسيحتاج أيضًا إلى كلمة المرور.",
      "ابدأ المشاركة",
      "Linkify / الخصوصية", "سياسة الخصوصية",
      "تُحفظ الملفات المرفوعة في حاوية Cloudflare R2 خاصة ولا تُنشر كعناصر عامة. يلزم رابط مشاركة موقّع لطلب الوصول عبر Linkify.",
      "الحماية بكلمة مرور",
      "كلمة المرور وسيلة للتحقق من الوصول وليست تشفيرًا. يجب أن يتراوح طولها بين 6 و128 حرفًا. يتحقق Linkify منها قبل إصدار عنوان تخزين قصير الأجل؛ والملف نفسه غير مشفّر من طرف إلى طرف. لا تُضمّن كلمة المرور في رابط المشاركة. تخزّن قاعدة البيانات تجزئة HMAC-SHA-256 بمفتاح، لا النص الصريح، ويتعامل Linkify مع كلمة المرور عند التحقق منها. شاركها منفصلة عن الرابط واختر كلمة مرور فريدة يصعب تخمينها.",
      "بعد إصدار Linkify عنوان تخزين مباشرًا، يمكن استخدامه دون إدخال كلمة المرور مجددًا حتى انتهاء صلاحيته، وبحد أقصى خمس دقائق من وقت الإصدار. لا يؤدي إلغاء الرابط أو تغيير حالته إلى سحب عنوان صدر بالفعل أو ملف نزّله شخص ما.",
      "انتهاء الصلاحية تلقائيًا",
      "تبدأ المدة المحددة، ساعة أو يومًا أو أسبوعًا، بعد اكتمال الرفع بنجاح فقط. عند حلول الموعد، يتوقف Linkify عن قبول رابط المشاركة. تحذف مهمة تنظيف العنصر أثناء عمل الخدمة؛ وإذا توقفت الخدمة في وضع الخمول، ينتظر الحذف الفعلي حتى تشغيلها مجددًا. لذلك ينتهي الوصول للرابط في موعده، لكن قد يتأخر حذف التخزين.",
      "يمكن استئناف الرفع المنقطع لمدة تصل إلى 7 أيام في ملف المتصفح الشخصي نفسه إذا احتُفظ ببيانات الموقع واخترت الملف نفسه مجددًا. تُحذف الأجزاء غير المكتملة بعد ذلك وفق قاعدة دورة حياة التخزين المهيأة.",
      "المعلومات التي نحتفظ بها",
      "لا نخزّن محتوى الملفات في قاعدة البيانات. نحتفظ فيها بالبيانات الوصفية، مثل معرّف الملف واسمه ونوع المحتوى وحجمه وحالة الرفع والطوابع الزمنية ووقت انتهاء الصلاحية وتجزئة كلمة المرور عند تعيينها وعدد التنزيلات. يُحذف الملف من التخزين بعد انتهاء رابط المشاركة وتشغيل مهمة التنظيف.",
      "يُسجّل كل تنزيل مع معرّف الملف ووقته وتجزئة بمفتاح لعنوان IP للزائر وسلسلة وكيل المستخدم للمتصفح. تبقى سجلات التنزيل والبيانات الوصفية في قاعدة البيانات ما لم تُحذف يدويًا.",
      "بما أن خدمات مشاركة الملفات تتعامل مع محتوى المستخدمين، فأنت مسؤول عن المعلومات التي ترفعها وتشاركها. يُرجى عدم رفع بيانات شخصية أو مستندات حساسة إلا إذا كنت تنوي مشاركتها عبر الرابط المحمي المحدد.",
      "العودة إلى التطبيق",
      "Linkify / الشروط", "شروط الخدمة",
      "يتيح لك Linkify رفع الملفات وإنشاء روابط مشاركة خاصة وحمايتها اختياريًا بكلمة مرور.",
      "أنت مسؤول عن الملفات التي ترفعها والأشخاص الذين تشاركها معهم. لا ترفع محتوى يخالف القانون أو ينتهك حقوق الآخرين أو يحتوي على برمجيات ضارة أو مواد مسيئة.",
      "نقدم الخدمة كما هي، وقد نعلّق الروابط التي تسيء استخدام المنصة أو تحتوي على محتوى ضار أو تعرقل التشغيل المعتاد أو نزيلها.",
      "تُخزّن الملفات في حاوية تخزين كائنات خاصة. الحماية بكلمة مرور تحقق الوصول ولا تشفّر الملف: يتحقق النظام من كلمة المرور قبل إصدار عنوان تخزين مباشر يظل صالحًا حتى خمس دقائق. حافظ على خصوصية روابط المشاركة وكلمات المرور، وشارك كلمات المرور منفصلة عن روابطها.",
      "تبدأ مدة الرابط المحددة عند اكتمال الرفع. يُرفض الوصول إلى الرابط عند انتهاء صلاحيته، بينما قد يتأخر حذف العنصر المخزّن حتى تشغيل مهمة التنظيف.",
      "نحتفظ في قاعدة البيانات لكل عملية رفع باسم الملف ونوع المحتوى والحجم ومعرّف الملف والحالة والطوابع الزمنية للرفع/الإكمال ووقت انتهاء الرابط وتجزئة كلمة المرور عند تعيينها. قد تبقى البيانات الوصفية بعد حذف الملف المخزّن.",
      "عند تنزيل ملف، نسجّل معرّفه ووقت التنزيل وتجزئة بمفتاح لعنوان IP للزائر وسلسلة وكيل المستخدم لمتصفحه. تُحتفظ بسجلات التنزيل والبيانات الوصفية في قاعدة البيانات. لا نخزن كلمات المرور نفسها، لكننا نحتفظ بتجزئة للتحقق من الروابط المحمية.",
      "باستخدام Linkify، فإنك توافق على هذه الشروط وعلى القوانين المحلية أو الإقليمية المنطبقة على مشاركة الملفات والخدمات عبر الإنترنت."
    ],
    hi: [
      "Linkify होम", "मुख्य नेविगेशन", "यह कैसे काम करता है", "परिचय", "नियम", "गोपनीयता", "भाषा",
      "Linkify के बारे में", "बड़ी फ़ाइलें। कम झंझट।",
      "Linkify से खाता बनाए बिना या ईमेल अटैचमेंट की सीमाओं से जूझे बिना फ़ाइल भेजना आसान है। फ़ाइल अपलोड करें, लिंक की अवधि चुनें और ज़रूरतमंद लोगों के साथ साझा करें।",
      "सेटअप के लिए नहीं, साझा करने के लिए",
      "1 GB तक की फ़ाइलें सीधे आपके ब्राउज़र से निजी स्टोरेज में अपलोड होती हैं। कनेक्शन टूटने पर उसी ब्राउज़र में वही फ़ाइल फिर चुनकर जारी रख सकते हैं। अपलोड पूरा होने पर बना लिंक साझा करें; उसकी समय-सीमा Linkify संभालेगा।",
      "कुछ उपयोगी सुविधाएँ", "1 GB तक भेजें", "बड़ी फ़ाइलें साझा करें जिन्हें संदेश में जोड़ना मुश्किल है।",
      "अपलोड फिर शुरू करें", "उसी ब्राउज़र में बाधित ट्रांसफ़र को 7 दिनों तक जारी रखें।",
      "खाते की ज़रूरत नहीं", "साइनअप या प्रोफ़ाइल संभाले बिना तुरंत साझा करना शुरू करें।",
      "लिंक की अवधि चुनें", "अपलोड के एक घंटे, एक दिन या एक सप्ताह बाद लिंक समाप्त होने दें।",
      "वैकल्पिक पासवर्ड जाँच", "पहुँच की एक और जाँच जोड़ें। पासवर्ड सुरक्षा फ़ाइल एन्क्रिप्शन नहीं है।",
      "निजी स्टोरेज", "फ़ाइलें सार्वजनिक ऑब्जेक्ट के रूप में प्रकाशित नहीं होतीं; पहुँच शेयर लिंक से माँगी जाती है।", "फ़ाइल साझा करें",
      "संक्षिप्त मार्गदर्शिका", "फ़ाइल से साझा लिंक तक।",
      "फ़ाइल चुनें, कुछ विकल्प तय करें और एक लिंक साझा करें। खाते या ईमेल अटैचमेंट की ज़रूरत नहीं।",
      "तीन आसान चरण", "01 / चुनें", "1 GB तक की फ़ाइल चुनें। उसे अपलोड क्षेत्र में खींचें या ब्राउज़ करके चुनें।",
      "02 / पहुँच तय करें", "समाप्ति का समय चुनें और चाहें तो लिंक के लिए पासवर्ड जाँच जोड़ें।",
      "03 / साझा करें", "अपलोड पूरा होने पर लिंक कॉपी करें और पाने वाले को भेजें।",
      "अक्सर पूछे जाने वाले सवाल", "बड़ी फ़ाइलें कैसे भेजूँ?",
      "अपलोड बीच में रुक जाए तो?", "उसी ब्राउज़र प्रोफ़ाइल में लौटें और 7 दिनों के भीतर वही फ़ाइल फिर चुनें। जब तक ब्राउज़र में सहेजा डेटा और अधूरे स्टोरेज हिस्से उपलब्ध हैं, Linkify अपलोड जारी रख सकता है।",
      "क्या मुझे खाते की ज़रूरत है?", "नहीं। बिना साइन अप किए फ़ाइल अपलोड करके शेयर लिंक बना सकते हैं।",
      "क्या मैं पासवर्ड जोड़ सकता हूँ?", "हाँ। अपलोड से पहले पासवर्ड सुरक्षा चालू करें और पासवर्ड चुनें। यह फ़ाइल की पहुँच जाँचता है, फ़ाइल एन्क्रिप्ट नहीं करता; इसलिए पासवर्ड लिंक से अलग साझा करें।",
      "शेयर लिंक कितने समय तक रहता है?",
      "एक घंटा, एक दिन या एक सप्ताह चुनें। अपलोड पूरा होने के बाद उलटी गिनती शुरू होती है। समय समाप्त होने पर Linkify लिंक स्वीकार करना बंद कर देता है; पहले जारी किया गया स्टोरेज URL पाँच मिनट तक काम कर सकता है।",
      "क्या लिंक से फ़ाइल डाउनलोड की जा सकती है?", "हाँ। लिंक वाला कोई भी व्यक्ति उसकी वैधता के दौरान खोल सकता है। पासवर्ड सुरक्षा चालू होने पर पासवर्ड भी चाहिए।",
      "साझा करना शुरू करें",
      "Linkify / गोपनीयता", "गोपनीयता नीति",
      "अपलोड की गई फ़ाइलें निजी Cloudflare R2 बकेट में रखी जाती हैं, सार्वजनिक ऑब्जेक्ट के रूप में प्रकाशित नहीं होतीं। Linkify के ज़रिए पहुँच माँगने के लिए हस्ताक्षरित शेयर लिंक ज़रूरी है।",
      "पासवर्ड सुरक्षा",
      "पासवर्ड पहुँच की जाँच है, एन्क्रिप्शन नहीं। पासवर्ड 6 से 128 अक्षरों का होना चाहिए। Linkify कम समय के स्टोरेज URL जारी करने से पहले इसकी जाँच करता है; फ़ाइल एंड-टू-एंड एन्क्रिप्टेड नहीं है। पासवर्ड शेयर लिंक में शामिल नहीं होता। डेटाबेस पासवर्ड का सादा पाठ नहीं, बल्कि keyed HMAC-SHA-256 हैश रखता है; जाँच के समय Linkify पासवर्ड संभालता है। पासवर्ड लिंक से अलग साझा करें और अनोखा, अनुमान लगाना कठिन पासवर्ड चुनें।",
      "Linkify द्वारा सीधा स्टोरेज URL जारी होने के बाद, समाप्ति तक बिना दोबारा पासवर्ड डाले उसका उपयोग किया जा सकता है; जारी होने के पाँच मिनट बाद तक। लिंक रद्द करने या उसकी स्थिति बदलने से पहले जारी URL या डाउनलोड की गई फ़ाइल वापस नहीं ली जा सकती।",
      "स्वचालित समाप्ति",
      "चुनी गई 1 घंटे, 1 दिन या 1 सप्ताह की अवधि सफल अपलोड पूरा होने के बाद ही शुरू होती है। समय पूरा होने पर Linkify लिंक स्वीकार करना बंद कर देता है। सेवा चालू रहने पर सफ़ाई का काम ऑब्जेक्ट हटाता है; निष्क्रिय रहते सेवा बंद हो जाए तो भौतिक हटाना उसके फिर शुरू होने तक रुका रहता है। इसलिए लिंक की पहुँच समय पर समाप्त होती है, पर स्टोरेज बाद में हट सकता है।",
      "बाधित अपलोड उसी ब्राउज़र प्रोफ़ाइल में 7 दिनों तक फिर शुरू हो सकता है, यदि साइट डेटा सुरक्षित रहे और आप वही फ़ाइल फिर चुनें। अधूरे हिस्से इस अवधि के बाद कॉन्फ़िगर की गई स्टोरेज लाइफ़साइकल नीति से हटाए जाते हैं।",
      "हम कौन-सी जानकारी रखते हैं",
      "हम डेटाबेस में फ़ाइल की सामग्री नहीं रखते। वहाँ फ़ाइल पहचानकर्ता, नाम, सामग्री प्रकार, आकार, अपलोड स्थिति, समय-मुद्राएँ, समाप्ति समय, सेट होने पर पासवर्ड हैश और डाउनलोड संख्या जैसे मेटाडेटा रखते हैं। लिंक समाप्त होने और सफ़ाई का काम चलने के बाद फ़ाइल स्टोरेज से हटाई जाती है।",
      "हर डाउनलोड में फ़ाइल पहचानकर्ता, समय, आगंतुक के IP पते का keyed हैश और ब्राउज़र का user-agent स्ट्रिंग लॉग किया जाता है। ये डाउनलोड लॉग और फ़ाइल मेटाडेटा मैन्युअल रूप से हटाए जाने तक डेटाबेस में रहते हैं।",
      "फ़ाइल-साझाकरण सेवाएँ उपयोगकर्ता सामग्री संभालती हैं, इसलिए अपलोड और साझा की गई जानकारी के लिए आप ज़िम्मेदार हैं। जब तक चुने गए सुरक्षित लिंक से साझा करने का इरादा न हो, व्यक्तिगत डेटा या संवेदनशील दस्तावेज़ अपलोड न करें।",
      "ऐप पर वापस जाएँ",
      "Linkify / नियम", "सेवा की शर्तें",
      "Linkify से फ़ाइलें अपलोड करें, निजी शेयर लिंक बनाएँ और चाहें तो उन्हें पासवर्ड से सुरक्षित करें।",
      "अपलोड की गई फ़ाइलों और उन्हें साझा किए गए लोगों की ज़िम्मेदारी आपकी है। कानून का उल्लंघन करने वाली, दूसरों के अधिकारों का हनन करने वाली या मैलवेयर अथवा अपमानजनक सामग्री वाली फ़ाइलें अपलोड न करें।",
      "हम सेवा जैसी है वैसी प्रदान करते हैं और प्लेटफ़ॉर्म का दुरुपयोग करने, हानिकारक सामग्री रखने या सामान्य संचालन में बाधा डालने वाले लिंक निलंबित या हटा सकते हैं।",
      "फ़ाइलें निजी ऑब्जेक्ट-स्टोरेज बकेट में रखी जाती हैं। पासवर्ड सुरक्षा पहुँच जाँचती है, फ़ाइल एन्क्रिप्ट नहीं करती: पाँच मिनट तक उपयोग योग्य सीधा स्टोरेज URL जारी करने से पहले सेवा पासवर्ड जाँचती है। शेयर लिंक और पासवर्ड निजी रखें, और पासवर्ड लिंक से अलग साझा करें।",
      "चुनी गई लिंक अवधि अपलोड पूरा होने पर शुरू होती है। अवधि समाप्त होने पर लिंक से पहुँच अस्वीकार होती है, जबकि संग्रहीत ऑब्जेक्ट बाद में सफ़ाई का काम चलने पर हट सकता है।",
      "हर अपलोड के लिए हम डेटाबेस में फ़ाइल नाम, सामग्री प्रकार, आकार, पहचानकर्ता, स्थिति, अपलोड/पूरा होने के समय, लिंक समाप्ति समय और पासवर्ड सेट होने पर उसका हैश रखते हैं। संग्रहीत फ़ाइल हटने के बाद भी मेटाडेटा डेटाबेस में रह सकता है।",
      "फ़ाइल डाउनलोड होने पर हम फ़ाइल पहचानकर्ता, डाउनलोड समय, आगंतुक के IP का keyed हैश और उनके ब्राउज़र का user-agent स्ट्रिंग दर्ज करते हैं। डाउनलोड रिकॉर्ड और फ़ाइल मेटाडेटा डेटाबेस में रखे जाते हैं। पासवर्ड स्वयं संग्रहीत नहीं होते, लेकिन सुरक्षित लिंक सत्यापित करने के लिए हैश रखा जाता है।",
      "Linkify का उपयोग करके आप इन शर्तों और फ़ाइल साझा करने तथा ऑनलाइन सेवाओं पर लागू स्थानीय या क्षेत्रीय कानूनों से सहमत होते हैं।"
    ],
    zh: [
      "Linkify 首页", "主导航", "使用方法", "关于", "条款", "隐私", "语言",
      "关于 Linkify", "大文件，轻松分享。",
      "Linkify 让你无需创建账户，也不用受电子邮件附件大小限制困扰，就能轻松发送文件。上传文件，选择链接有效期，再分享给需要的人。",
      "专为分享而设计，无需繁琐设置",
      "最大 1 GB 的文件可直接从浏览器上传到私人存储空间。如果连接中断，可在同一浏览器中重新选择同一文件继续上传。上传完成后，分享生成的链接，过期时间由 Linkify 处理。",
      "贴心实用的功能", "发送最大 1 GB 的文件", "分享那些不便作为邮件附件发送的大文件。",
      "续传文件", "在同一浏览器中继续中断的传输，最长可达 7 天。",
      "无需账户", "无需注册或管理个人资料，即可立即开始分享。",
      "选择链接有效期", "设置链接在上传后一小时、一天或一周失效。",
      "可选密码验证", "增加一道访问验证。密码保护并不等于文件加密。",
      "私人存储", "文件不会作为公共对象发布；需通过分享链接请求访问。", "分享文件",
      "快速指南", "从文件到分享链接。",
      "选择文件并设置几个选项，然后分享一个链接。无需账户或电子邮件附件。",
      "简单三步", "01 / 选择", "选择最大 1 GB 的文件。可将文件拖到上传区域，或浏览选择。",
      "02 / 设置访问权限", "选择失效时间，也可以为链接添加密码验证。",
      "03 / 分享", "上传完成后，复制链接并发送给接收者。",
      "常见问题", "如何发送大文件？",
      "如果上传中断怎么办？", "在 7 天内使用同一浏览器配置文件返回，并重新选择同一文件。只要浏览器保存的数据和未完成的存储分块仍然可用，Linkify 就能继续上传。",
      "需要账户吗？", "不需要。无需注册即可上传文件并创建分享链接。",
      "可以添加密码吗？", "可以。在上传前启用密码保护并设置密码。密码用于验证文件访问权限，不会加密文件，因此请将密码与链接分开分享。",
      "分享链接可以使用多久？",
      "可选一小时、一天或一周。倒计时从上传完成后开始。到期后 Linkify 将不再接受该分享链接；已签发的存储网址可能仍可使用最多五分钟。",
      "可以通过链接下载文件吗？", "可以。任何持有链接的人都能在链接有效时打开它。如果启用了密码保护，还需要密码。",
      "开始分享",
      "Linkify / 隐私", "隐私政策",
      "上传的文件存放在私有 Cloudflare R2 存储桶中，不会作为公共对象发布。通过 Linkify 请求访问需要使用已签名的分享链接。",
      "密码保护",
      "密码用于访问验证，而非加密。密码长度必须为 6 至 128 个字符。Linkify 会在签发短时有效的存储网址前验证密码；文件本身并未进行端到端加密。密码不会嵌入分享链接。数据库保存的是带密钥的 HMAC-SHA-256 密码哈希，而非明文；Linkify 会在验证时处理密码。请将密码与链接分开分享，并选择唯一且难以猜测的密码。",
      "Linkify 签发直接存储网址后，在网址过期前无需再次输入密码即可使用，最长不超过签发后五分钟。撤销链接或更改其状态无法收回已签发的网址，也无法收回他人已下载的文件。",
      "自动过期",
      "所选的一小时、一天或一周有效期仅在上传成功完成后开始计算。到期时，Linkify 将停止接受分享链接。服务运行时，清理任务会删除对象；若服务在空闲时停止，则须等服务重新启动后才会实际删除。因此链接访问会按时过期，但存储数据可能稍后才删除。",
      "如果保留了网站数据，并在同一浏览器配置文件中重新选择同一文件，中断的上传最多可在 7 天内续传。超过此期限后，配置的存储生命周期规则会删除未完成的分块。",
      "我们保留的信息",
      "我们不会在数据库中存储文件内容，但会保存文件标识符、名称、内容类型、大小、上传状态、时间戳、过期时间、设置时的密码哈希和下载次数等文件元数据。链接过期且清理任务运行后，文件本身会从存储中删除。",
      "每次下载都会记录文件标识符、时间、访客 IP 地址的带密钥哈希以及浏览器 user-agent 字符串。除非手动删除，这些下载日志和文件元数据会保留在数据库中。",
      "文件分享服务会处理用户内容，因此你应对上传和分享的信息负责。除非打算通过所选的受保护链接分享，否则请勿上传个人数据或敏感文件。",
      "返回应用",
      "Linkify / 条款", "服务条款",
      "Linkify 可让你上传文件、生成私人分享链接，并可选择使用密码保护链接。",
      "你应对上传的文件以及分享对象负责。请勿上传违法、侵犯他人权利、包含恶意软件或滥用内容的文件。",
      "我们按现状提供服务，并可能暂停或删除滥用平台、包含有害内容或妨碍正常运行的链接。",
      "文件存储在私有对象存储桶中。密码保护用于访问验证，并非文件加密：服务会先验证密码，再签发最长可使用五分钟的直接存储网址。请妥善保管分享链接和密码，并将密码与链接分开分享。",
      "所选链接有效期从上传完成时开始。到期后将拒绝通过链接访问，但存储对象可能要等清理任务运行后才会删除。",
      "每次上传时，我们会在数据库中保存文件名、内容类型、大小、文件标识符、状态、上传/完成时间戳、链接过期时间以及设置时的密码哈希。存储文件删除后，文件元数据仍可能保留在数据库中。",
      "有人下载文件时，我们会记录文件标识符、下载时间、访客 IP 地址的带密钥哈希以及其浏览器 user-agent 字符串。下载记录和文件元数据会保留在数据库中。我们不存储密码本身，但会保存哈希以验证受保护的链接。",
      "使用 Linkify 即表示你同意这些条款以及适用于文件分享和在线服务的当地或地区法律。"
    ],
    tr: [
      "Linkify ana sayfa", "Ana gezinme", "Nasıl çalışır?", "Hakkında", "Koşullar", "Gizlilik", "Dil",
      "Linkify hakkında", "Büyük dosyalar. Daha az uğraş.",
      "Linkify, hesap oluşturmadan veya e-posta eki sınırlarıyla uğraşmadan dosya göndermeyi kolaylaştırır. Dosyayı yükleyin, bağlantının ne kadar süre çalışacağını seçin ve ihtiyacı olan kişilerle paylaşın.",
      "Kurulum için değil, paylaşım için tasarlandı",
      "1 GB'a kadar dosyalar doğrudan tarayıcınızdan özel depolama alanına yüklenir. Bağlantınız kesilirse aynı dosyayı yeniden seçerek aynı tarayıcıda devam edebilirsiniz. Yükleme bitince oluşturulan bağlantıyı paylaşın; sona erme sürecini Linkify yönetir.",
      "Düşünülmüş birkaç ekstra", "1 GB'a kadar gönderin", "Mesaja eklemesi zor olan büyük dosyaları paylaşın.",
      "Yüklemeye devam edin", "Kesintiye uğrayan aktarımı aynı tarayıcıda 7 güne kadar sürdürün.",
      "Hesap gerekmez", "Kayıt olmadan veya profil yönetmeden hemen paylaşmaya başlayın.",
      "Bağlantı süresini seçin", "Bağlantıyı yüklemeden bir saat, bir gün veya bir hafta sonra sona erecek şekilde ayarlayın.",
      "İsteğe bağlı parola kontrolü", "Ek bir erişim kontrolü ekleyin. Parola koruması dosya şifrelemesi değildir.",
      "Özel depolama", "Dosyalar herkese açık nesneler olarak yayımlanmaz; erişim bir paylaşım bağlantısıyla istenir.", "Dosya paylaş",
      "Hızlı rehber", "Dosyadan paylaşılan bağlantıya.",
      "Bir dosya seçin, birkaç seçenek belirleyin ve tek bir bağlantı paylaşın. Hesap veya e-posta eki gerekmez.",
      "Üç basit adım", "01 / Seçin", "1 GB'a kadar bir dosya seçin. Dosyayı yükleme alanına sürükleyin veya göz atarak bulun.",
      "02 / Erişimi ayarlayın", "Bir sona erme zamanı seçin ve isterseniz bağlantıya parola kontrolü ekleyin.",
      "03 / Paylaşın", "Yükleme tamamlandığında bağlantıyı kopyalayıp alıcıya gönderin.",
      "Sık sorulan sorular", "Büyük dosyaları nasıl gönderirim?",
      "Yüklemem kesilirse ne olur?", "Aynı tarayıcı profiline dönün ve 7 gün içinde aynı dosyayı yeniden seçin. Kaydedilmiş tarayıcı verileri ve tamamlanmamış depolama parçaları mevcut olduğu sürece Linkify yüklemeye devam edebilir.",
      "Hesap açmam gerekiyor mu?", "Hayır. Kaydolmadan dosya yükleyip paylaşım bağlantısı oluşturabilirsiniz.",
      "Parola ekleyebilir miyim?", "Evet. Yüklemeden önce parola korumasını açıp bir parola belirleyin. Parola dosyaya erişimi kontrol eder ancak dosyayı şifrelemez; parolayı bağlantıdan ayrı paylaşın.",
      "Paylaşım bağlantısı ne kadar süre geçerlidir?",
      "Bir saat, bir gün veya bir hafta seçin. Geri sayım yükleme tamamlandıktan sonra başlar. Süre dolunca Linkify bağlantıyı kabul etmez; daha önce verilmiş bir depolama URL'si beş dakikaya kadar kullanılabilir.",
      "Bağlantı dosyayı indirmek için kullanılabilir mi?", "Evet. Bağlantıya sahip olan herkes geçerli olduğu sürece açabilir. Parola korumasını etkinleştirdiyseniz parola da gerekir.",
      "Paylaşmaya başlayın",
      "Linkify / Gizlilik", "Gizlilik Politikası",
      "Yüklenen dosyalar özel bir Cloudflare R2 paketinde tutulur ve herkese açık nesneler olarak yayımlanmaz. Linkify üzerinden erişim istemek için imzalı bir paylaşım bağlantısı gerekir.",
      "Parola koruması",
      "Parola şifreleme değil, erişim kontrolüdür. Parolalar 6 ila 128 karakter olmalıdır. Linkify kısa süreli bir depolama URL'si vermeden önce parolayı kontrol eder; dosyanın kendisi uçtan uca şifrelenmez. Parola paylaşım bağlantısına eklenmez. Veritabanında parolanın düz metni değil, anahtarlı HMAC-SHA-256 özeti tutulur; Linkify kontrol sırasında parolayı işler. Parolayı bağlantıdan ayrı paylaşın ve benzersiz, tahmin edilmesi zor bir parola seçin.",
      "Linkify doğrudan depolama URL'si verdikten sonra bu URL, sona erene kadar parolayı yeniden girmeden kullanılabilir; bu süre en fazla beş dakikadır. Bir bağlantıyı iptal etmek veya durumunu değiştirmek önceden verilmiş URL'yi ya da indirilmiş dosyayı geri alamaz.",
      "Otomatik sona erme",
      "Seçilen 1 saatlik, 1 günlük veya 1 haftalık süre yalnızca yükleme başarıyla tamamlandıktan sonra başlar. Süre dolduğunda Linkify paylaşım bağlantısını kabul etmeyi durdurur. Temizleme işi hizmet çalışırken nesneyi siler; hizmet boştayken durmuşsa fiziksel silme yeniden başlayana kadar bekler. Böylece bağlantı erişimi zamanında sona erer, depolama daha sonra kaldırılabilir.",
      "Kesintiye uğrayan bir yükleme, site verileri korunuyorsa ve aynı dosyayı yeniden seçerseniz aynı tarayıcı profilinde 7 güne kadar devam ettirilebilir. Tamamlanmamış parçalar bu süreden sonra yapılandırılmış depolama yaşam döngüsü kuralıyla kaldırılır.",
      "Sakladığımız bilgiler",
      "Dosya içeriklerini veritabanında saklamayız. Dosya kimliği, adı, içerik türü, boyutu, yükleme durumu, zaman damgaları, sona erme zamanı, ayarlanmışsa parola özeti ve indirme sayısı gibi dosya meta verilerini tutarız. Bağlantı sona erip temizleme işi çalıştıktan sonra dosyanın kendisi depolamadan silinir.",
      "Her indirme; dosya kimliği, zaman, ziyaretçinin IP adresinin anahtarlı özeti ve tarayıcının user-agent dizesiyle kaydedilir. Bu indirme günlükleri ve dosya meta verileri elle silinmedikçe veritabanında kalır.",
      "Dosya paylaşım hizmetleri kullanıcı içeriğini işlediğinden yüklediğiniz ve paylaştığınız bilgilerden siz sorumlusunuz. Seçilen korumalı bağlantıyla paylaşmayı amaçlamadığınız kişisel verileri veya hassas belgeleri yüklemeyin.",
      "Uygulamaya dön",
      "Linkify / Koşullar", "Hizmet Koşulları",
      "Linkify dosya yüklemenizi, özel paylaşım bağlantıları oluşturmanızı ve isterseniz bu bağlantıları parolayla korumanızı sağlar.",
      "Yüklediğiniz dosyalardan ve paylaştığınız kişilerden siz sorumlusunuz. Yasaları ihlal eden, başkalarının haklarını çiğneyen ya da kötü amaçlı yazılım veya kötüye kullanım içeriği barındıran dosyaları yüklemeyin.",
      "Hizmeti olduğu gibi sunarız; platformu kötüye kullanan, zararlı içerik barındıran veya normal çalışmayı engelleyen bağlantıları askıya alabilir ya da kaldırabiliriz.",
      "Dosyalar özel bir nesne depolama paketinde tutulur. Parola koruması şifreleme değil, erişim kontrolüdür: hizmet, beş dakikaya kadar kullanılabilen doğrudan depolama URL'si vermeden önce parolayı kontrol eder. Paylaşım bağlantılarını ve parolaları gizli tutun; parolaları bağlantılardan ayrı paylaşın.",
      "Seçilen bağlantı süresi yükleme tamamlandığında başlar. Süre dolunca bağlantı erişimi reddedilir; depolanan nesne temizleme işi çalıştığında daha sonra kaldırılabilir.",
      "Her yükleme için dosya adı, içerik türü, boyut, dosya kimliği, durum, yükleme/tamamlama zamanları, bağlantı sona erme zamanı ve ayarlanmışsa parola özetini veritabanında tutarız. Depolanan dosya silindikten sonra dosya meta verileri veritabanında kalabilir.",
      "Birisi dosyayı indirdiğinde dosya kimliğini, indirme zamanını, ziyaretçinin IP adresinin anahtarlı özetini ve tarayıcısının user-agent dizesini kaydederiz. İndirme kayıtları ve dosya meta verileri veritabanında tutulur. Parolaların kendisi saklanmaz; korumalı bağlantıları doğrulamak için özet tutulur.",
      "Linkify'ı kullanarak bu koşulları ve dosya paylaşımı ile çevrimiçi hizmetleri düzenleyen geçerli yerel veya bölgesel yasaları kabul etmiş olursunuz."
    ],
    ja: [
      "Linkify ホーム", "メインナビゲーション", "使い方", "概要", "利用規約", "プライバシー", "言語",
      "Linkify について", "大きなファイルも、手軽に。",
      "Linkifyなら、アカウントを作成したりメール添付の容量制限に悩んだりせず、簡単にファイルを送れます。アップロードしてリンクの有効期間を選び、必要な相手に共有しましょう。",
      "設定より、共有をシンプルに",
      "最大1 GBのファイルをブラウザーからプライベートストレージへ直接アップロードできます。接続が切れても、同じブラウザーで同じファイルを選び直せば再開できます。アップロード後は生成されたリンクを共有するだけで、有効期限はLinkifyが管理します。",
      "便利な機能", "最大1 GBを送信", "メッセージに添付しにくい大きなファイルを共有できます。",
      "アップロードを再開", "中断した転送を同じブラウザーで最大7日間再開できます。",
      "アカウント不要", "登録やプロフィール管理なしですぐに共有できます。",
      "リンクの有効期間を選択", "アップロードの1時間後、1日後、または1週間後にリンクを失効させます。",
      "任意のパスワード確認", "アクセス確認を追加できます。パスワード保護はファイルの暗号化ではありません。",
      "プライベートストレージ", "ファイルは公開オブジェクトとして公開されず、共有リンクを通じてアクセスを要求します。", "ファイルを共有",
      "クイックガイド", "ファイルから共有リンクへ。",
      "ファイルを選び、いくつかのオプションを設定してリンクを共有します。アカウントやメール添付は不要です。",
      "簡単な3ステップ", "01 / 選択", "最大1 GBのファイルを選択します。アップロード領域にドラッグするか、ファイルを参照してください。",
      "02 / アクセス設定", "有効期限を選び、必要に応じてリンクにパスワード確認を追加します。",
      "03 / 共有", "アップロードが完了したらリンクをコピーして相手に送ります。",
      "よくある質問", "大きなファイルを送るには？",
      "アップロードが中断された場合は？", "同じブラウザープロファイルで7日以内に戻り、同じファイルを選び直してください。保存済みのブラウザーデータと未完了のストレージ部分が利用可能であれば、Linkifyがアップロードを再開できます。",
      "アカウントは必要ですか？", "いいえ。登録せずにファイルをアップロードして共有リンクを作成できます。",
      "パスワードを追加できますか？", "はい。アップロード前にパスワード保護を有効にして設定してください。ファイルへのアクセスを確認しますが、ファイルは暗号化されません。パスワードはリンクとは別に共有してください。",
      "共有リンクの有効期間は？",
      "1時間、1日、または1週間を選択します。カウントダウンはアップロード完了後に始まります。期限が切れるとLinkifyはリンクを受け付けませんが、発行済みのストレージURLは最大5分間利用できる場合があります。",
      "リンクからファイルをダウンロードできますか？", "はい。有効な間はリンクを持つ人なら誰でも開けます。パスワード保護を有効にした場合は、パスワードも必要です。",
      "共有を始める",
      "Linkify / プライバシー", "プライバシーポリシー",
      "アップロードされたファイルは非公開のCloudflare R2バケットに保存され、公開オブジェクトとして公開されません。Linkify経由でアクセスを要求するには署名付き共有リンクが必要です。",
      "パスワード保護",
      "パスワードはアクセス確認であり、暗号化ではありません。パスワードは6～128文字にしてください。Linkifyは有効期間の短いストレージURLを発行する前に確認します。ファイル自体はエンドツーエンド暗号化されません。パスワードは共有リンクに含まれません。データベースには平文ではなく鍵付きHMAC-SHA-256ハッシュが保存され、確認時にLinkifyがパスワードを処理します。リンクとは別に共有し、一意で推測されにくいパスワードを選んでください。",
      "Linkifyが直接のストレージURLを発行すると、期限切れまでパスワードを再入力せずに使用できます。ただし発行後最長5分です。リンクの取り消しや状態変更をしても、発行済みURLやダウンロード済みファイルを無効にはできません。",
      "自動失効",
      "選択した1時間、1日、または1週間の有効期間は、アップロードが正常に完了した後にのみ開始します。期限になるとLinkifyは共有リンクを受け付けなくなります。サービス稼働中はクリーンアップ処理がオブジェクトを削除します。サービスがアイドル状態で停止していた場合、物理削除は再起動後になります。リンクへのアクセスは予定どおり失効しますが、ストレージからの削除は遅れることがあります。",
      "サイトデータが保持され、同じファイルを選び直せば、同じブラウザープロファイルで中断したアップロードを最大7日間再開できます。未完了部分はその期間後、設定されたストレージライフサイクルルールで削除されます。",
      "保存する情報",
      "ファイルの内容はデータベースに保存しません。ファイルID、名前、コンテンツタイプ、サイズ、アップロード状態、タイムスタンプ、有効期限、設定時のパスワードハッシュ、ダウンロード数などのメタデータを保存します。リンクの期限切れ後、クリーンアップ処理が行われるとファイルはストレージから削除されます。",
      "各ダウンロードについて、ファイルID、時刻、訪問者のIPアドレスの鍵付きハッシュ、ブラウザーのuser-agent文字列を記録します。手動で削除されない限り、ログとファイルのメタデータはデータベースに残ります。",
      "ファイル共有サービスはユーザーコンテンツを扱うため、アップロードして共有する情報はご自身の責任となります。選択した保護リンクで共有する意図がない限り、個人データや機密文書をアップロードしないでください。",
      "アプリに戻る",
      "Linkify / 利用規約", "利用規約",
      "Linkifyではファイルをアップロードして非公開の共有リンクを作成し、必要に応じてパスワードで保護できます。",
      "アップロードするファイルと共有相手についてはご自身が責任を負います。違法なコンテンツ、他者の権利を侵害する内容、マルウェアや不正な内容を含むファイルをアップロードしないでください。",
      "本サービスは現状有姿で提供されます。プラットフォームを悪用するリンク、有害なコンテンツを含むリンク、通常の運用を妨げるリンクは停止または削除する場合があります。",
      "ファイルは非公開のオブジェクトストレージバケットに保存されます。パスワード保護はアクセス確認であり、暗号化ではありません。サービスは最長5分間使用できる直接ストレージURLを発行する前にパスワードを確認します。共有リンクとパスワードは非公開にし、パスワードはリンクとは別に共有してください。",
      "選択したリンクの有効期間はアップロード完了時に始まります。期限切れ後はリンクアクセスが拒否されますが、保存オブジェクトの削除はクリーンアップ処理の実行後になる場合があります。",
      "各アップロードについて、ファイル名、コンテンツタイプ、サイズ、ファイルID、状態、アップロード/完了時刻、リンク有効期限、設定時のパスワードハッシュをデータベースに保存します。保存ファイルの削除後もメタデータが残る場合があります。",
      "ファイルがダウンロードされると、ファイルID、ダウンロード時刻、訪問者IPアドレスの鍵付きハッシュ、ブラウザーのuser-agent文字列を記録します。ダウンロード記録とファイルメタデータはデータベースに保持されます。パスワード自体は保存しませんが、保護リンクの確認用にハッシュを保持します。",
      "Linkifyを利用することで、本規約およびファイル共有やオンラインサービスに適用される地域または国の法律に同意したものとみなされます。"
    ],
    ru: [
      "Главная Linkify", "Основная навигация", "Как это работает", "О проекте", "Условия", "Конфиденциальность", "Язык",
      "О Linkify", "Большие файлы. Меньше хлопот.",
      "Linkify позволяет легко отправлять файлы без регистрации и ограничений на вложения в электронной почте. Загрузите файл, выберите срок действия ссылки и поделитесь ею с нужными людьми.",
      "Для обмена файлами, а не для настройки",
      "Файлы размером до 1 ГБ загружаются напрямую из браузера в закрытое хранилище. Если соединение прервётся, выберите тот же файл в том же браузере, чтобы продолжить. После загрузки поделитесь созданной ссылкой — Linkify позаботится об истечении срока её действия.",
      "Полезные дополнительные функции", "Отправка файлов до 1 ГБ", "Делитесь большими файлами, которые неудобно прикреплять к сообщениям.",
      "Возобновление загрузки", "Продолжайте прерванную передачу в том же браузере в течение 7 дней.",
      "Аккаунт не нужен", "Начните делиться сразу — регистрация и профиль не требуются.",
      "Выбор срока действия ссылки", "Ссылка истечёт через час, день или неделю после загрузки.",
      "Дополнительная проверка пароля", "Добавьте проверку доступа. Защита паролем — не шифрование файла.",
      "Закрытое хранилище", "Файлы не публикуются как общедоступные объекты; доступ запрашивается по ссылке.", "Поделиться файлом",
      "Краткое руководство", "От файла к ссылке.",
      "Выберите файл, задайте параметры и поделитесь одной ссылкой. Аккаунт и вложение в электронное письмо не нужны.",
      "Три простых шага", "01 / Выберите", "Выберите файл размером до 1 ГБ. Перетащите его в область загрузки или найдите на устройстве.",
      "02 / Настройте доступ", "Выберите срок действия и при желании добавьте проверку пароля для ссылки.",
      "03 / Поделитесь", "После завершения загрузки скопируйте ссылку и отправьте получателю.",
      "Часто задаваемые вопросы", "Как отправить большие файлы?",
      "Что делать, если загрузка прервалась?", "Вернитесь в тот же профиль браузера и в течение 7 дней выберите тот же файл. Linkify продолжит загрузку, пока доступны сохранённые данные браузера и незавершённые части в хранилище.",
      "Нужен ли аккаунт?", "Нет. Вы можете загрузить файл и создать ссылку без регистрации.",
      "Можно добавить пароль?", "Да. Включите защиту паролем перед загрузкой и задайте пароль. Он проверяет доступ к файлу, но не шифрует его; отправляйте пароль отдельно от ссылки.",
      "Как долго действует ссылка?",
      "Выберите час, день или неделю. Отсчёт начинается после завершения загрузки. По истечении срока Linkify перестанет принимать ссылку; уже выданный URL хранилища может оставаться доступным до пяти минут.",
      "Можно ли скачать файл по ссылке?", "Да. Любой обладатель ссылки может открыть её, пока она действует. При включённой защите также потребуется пароль.",
      "Начать делиться",
      "Linkify / Конфиденциальность", "Политика конфиденциальности",
      "Загруженные файлы хранятся в закрытом бакете Cloudflare R2 и не публикуются как общедоступные объекты. Для запроса доступа через Linkify нужна подписанная ссылка.",
      "Защита паролем",
      "Пароль проверяет доступ, но не шифрует файл. Длина пароля должна составлять от 6 до 128 символов. Linkify проверяет его перед выдачей краткосрочного URL хранилища; сквозного шифрования файла нет. Пароль не включается в ссылку. В базе хранится не открытый текст, а ключевой хеш HMAC-SHA-256; Linkify обрабатывает пароль при проверке. Передавайте пароль отдельно и используйте уникальную, сложную для угадывания комбинацию.",
      "После выдачи Linkify прямой URL хранилища можно использовать без повторного ввода пароля до истечения срока — не более пяти минут с момента выдачи. Отзыв ссылки или изменение её статуса не отменит уже выданный URL и не удалит скачанный файл.",
      "Автоматическое истечение срока",
      "Выбранный срок — 1 час, 1 день или 1 неделя — начинается только после успешного завершения загрузки. По истечении срока Linkify перестаёт принимать ссылку. Задача очистки удаляет объект, пока сервис работает; если сервис был остановлен в режиме ожидания, физическое удаление произойдёт после его запуска. Поэтому доступ по ссылке завершится вовремя, но удаление из хранилища может задержаться.",
      "Прерванную загрузку можно возобновить в том же профиле браузера в течение 7 дней, если данные сайта сохранены и вы снова выбрали тот же файл. После этого срока незавершённые части удаляются настроенным правилом жизненного цикла хранилища.",
      "Какие сведения мы храним",
      "Содержимое файлов в базе данных не хранится. Мы сохраняем метаданные: идентификатор и имя файла, тип содержимого, размер, статус загрузки, временные отметки, срок действия, хеш пароля (если задан) и число скачиваний. Сам файл удаляется из хранилища после истечения ссылки и запуска очистки.",
      "Для каждой загрузки файла записываются его идентификатор, время, ключевой хеш IP-адреса посетителя и строка user-agent браузера. Эти журналы и метаданные хранятся в базе данных, пока не будут удалены вручную.",
      "Сервисы обмена файлами обрабатывают пользовательский контент, поэтому вы отвечаете за загружаемую и передаваемую информацию. Не загружайте личные данные или конфиденциальные документы, если не собираетесь передавать их по выбранной защищённой ссылке.",
      "Вернуться в приложение",
      "Linkify / Условия", "Условия использования",
      "С помощью Linkify можно загружать файлы, создавать закрытые ссылки и при желании защищать их паролем.",
      "Вы отвечаете за загружаемые файлы и людей, с которыми ими делитесь. Не загружайте материалы, нарушающие закон или права других лиц, содержащие вредоносное ПО или оскорбительный контент.",
      "Сервис предоставляется «как есть». Мы можем приостановить или удалить ссылки, которые злоупотребляют платформой, содержат вредоносные материалы или мешают нормальной работе.",
      "Файлы хранятся в закрытом хранилище объектов. Пароль проверяет доступ, а не шифрует файл: перед выдачей прямого URL хранилища, действующего до пяти минут, сервис проверяет пароль. Не раскрывайте ссылки и пароли; передавайте пароли отдельно от ссылок.",
      "Выбранный срок действия ссылки начинается после завершения загрузки. По истечении срока доступ по ссылке отклоняется, а сохранённый объект может быть удалён позднее при запуске очистки.",
      "Для каждой загрузки в базе сохраняются имя файла, тип содержимого, размер, идентификатор, статус, время начала/завершения, срок действия ссылки и хеш пароля, если он задан. Метаданные могут остаться после удаления файла из хранилища.",
      "При скачивании файла мы записываем его идентификатор, время скачивания, ключевой хеш IP-адреса посетителя и строку user-agent браузера. Сведения о скачиваниях и метаданные хранятся в базе. Сами пароли не сохраняются, но для проверки защищённых ссылок хранится хеш.",
      "Используя Linkify, вы принимаете эти условия и применимые местные или региональные законы об обмене файлами и онлайн-сервисах."
    ],
    pt: [
      "Página inicial do Linkify", "Navegação principal", "Como funciona", "Sobre", "Termos", "Privacidade", "Idioma",
      "Sobre o Linkify", "Arquivos grandes. Sem complicação.",
      "O Linkify facilita o envio de arquivos sem criar uma conta nem lidar com limites de anexos de e-mail. Envie o arquivo, escolha por quanto tempo o link funcionará e compartilhe-o com quem precisa.",
      "Feito para compartilhar, não para configurar",
      "Arquivos de até 1 GB são enviados diretamente do navegador para um armazenamento privado. Se a conexão cair, você pode continuar no mesmo navegador selecionando o mesmo arquivo novamente. Quando o envio terminar, compartilhe o link gerado e deixe o Linkify cuidar da expiração.",
      "Alguns extras úteis", "Envie até 1 GB", "Compartilhe arquivos grandes que são difíceis de anexar a uma mensagem.",
      "Retome um envio", "Continue uma transferência interrompida no mesmo navegador por até 7 dias.",
      "Não precisa de conta", "Comece a compartilhar imediatamente, sem cadastro ou perfil para gerenciar.",
      "Escolha a duração do link", "Configure o link para expirar uma hora, um dia ou uma semana após o envio.",
      "Verificação de senha opcional", "Adicione outra verificação de acesso. A proteção por senha não criptografa o arquivo.",
      "Armazenamento privado", "Os arquivos não são publicados como objetos públicos; o acesso é solicitado por um link de compartilhamento.", "Compartilhar um arquivo",
      "Guia rápido", "Do arquivo ao link compartilhado.",
      "Escolha um arquivo, defina algumas opções e compartilhe um link. Não é preciso ter conta nem anexar arquivos a e-mails.",
      "Três passos simples", "01 / Escolher", "Selecione um arquivo de até 1 GB. Arraste-o para a área de envio ou procure-o.",
      "02 / Definir acesso", "Escolha quando expira e, se quiser, adicione uma verificação de senha ao link.",
      "03 / Compartilhar", "Quando o envio terminar, copie o link e envie-o ao destinatário.",
      "Perguntas frequentes", "Como envio arquivos grandes?",
      "E se o envio for interrompido?", "Volte usando o mesmo perfil do navegador e selecione o mesmo arquivo novamente em até 7 dias. O Linkify pode continuar o envio enquanto os dados salvos do navegador e as partes incompletas do armazenamento estiverem disponíveis.",
      "Preciso de uma conta?", "Não. Você pode enviar arquivos e criar um link de compartilhamento sem se cadastrar.",
      "Posso adicionar uma senha?", "Sim. Ative a proteção por senha antes do envio e escolha uma senha. Ela verifica o acesso ao arquivo, mas não o criptografa; compartilhe a senha separadamente do link.",
      "Por quanto tempo um link de compartilhamento dura?",
      "Escolha uma hora, um dia ou uma semana. A contagem começa quando o envio termina. Na expiração, o Linkify deixa de aceitar o link; uma URL de armazenamento já emitida pode continuar funcionando por até cinco minutos.",
      "É possível baixar o arquivo pelo link?", "Sim. Qualquer pessoa com o link pode abri-lo enquanto estiver válido. Se a proteção por senha estiver ativada, também será necessária a senha.",
      "Começar a compartilhar",
      "Linkify / Privacidade", "Política de Privacidade",
      "Os arquivos enviados ficam em um bucket privado do Cloudflare R2 e não são publicados como objetos públicos. É necessário um link de compartilhamento assinado para solicitar acesso pelo Linkify.",
      "Proteção por senha",
      "A senha verifica o acesso, não é criptografia. As senhas devem ter de 6 a 128 caracteres. O Linkify a verifica antes de emitir uma URL de armazenamento de curta duração; o arquivo não tem criptografia de ponta a ponta. A senha não é incluída no link. O banco de dados armazena um hash HMAC-SHA-256 com chave, não o texto simples, e o Linkify processa a senha durante a verificação. Compartilhe a senha separadamente do link e escolha uma senha única e difícil de adivinhar.",
      "Depois que o Linkify emite uma URL direta de armazenamento, ela pode ser usada sem informar a senha novamente até expirar, no máximo cinco minutos após a emissão. Revogar um link ou alterar seu status não invalida uma URL já emitida nem um arquivo já baixado.",
      "Expiração automática",
      "O prazo escolhido — 1 hora, 1 dia ou 1 semana — começa somente após a conclusão bem-sucedida do envio. No prazo final, o Linkify deixa de aceitar o link. Uma tarefa de limpeza exclui o objeto enquanto o serviço está ativo; se o serviço parou durante a inatividade, a exclusão física aguarda a próxima inicialização. Assim, o acesso expira no horário previsto, mas a remoção do armazenamento pode ocorrer depois.",
      "Um envio interrompido pode ser retomado por até 7 dias no mesmo perfil do navegador se os dados do site forem mantidos e você selecionar o mesmo arquivo novamente. As partes incompletas são removidas pela regra de ciclo de vida configurada após esse período.",
      "Informações que mantemos",
      "Não armazenamos o conteúdo dos arquivos no banco de dados. Mantemos metadados, como identificador, nome, tipo de conteúdo, tamanho, status do envio, horários, expiração, hash da senha quando definida e número de downloads. O arquivo é excluído do armazenamento após o link expirar e a tarefa de limpeza ser executada.",
      "Cada download é registrado com o identificador do arquivo, horário, hash com chave do endereço IP do visitante e a string user-agent do navegador. Esses registros e os metadados permanecem no banco de dados, a menos que sejam removidos manualmente.",
      "Como serviços de compartilhamento de arquivos lidam com conteúdo de usuários, você é responsável pelas informações que envia e compartilha. Não envie dados pessoais ou documentos confidenciais, a menos que pretenda compartilhá-los pelo link protegido escolhido.",
      "Voltar ao aplicativo",
      "Linkify / Termos", "Termos de Serviço",
      "O Linkify permite enviar arquivos, gerar links privados de compartilhamento e, opcionalmente, protegê-los com uma senha.",
      "Você é responsável pelos arquivos enviados e pelas pessoas com quem os compartilha. Não envie conteúdo ilegal, que viole os direitos de outras pessoas ou contenha malware ou material abusivo.",
      "Fornecemos o serviço como está e podemos suspender ou remover links que abusem da plataforma, contenham conteúdo prejudicial ou interfiram no funcionamento normal.",
      "Os arquivos ficam em um bucket privado de armazenamento de objetos. A proteção por senha verifica o acesso, não criptografa o arquivo: o serviço verifica a senha antes de emitir uma URL direta de armazenamento válida por até cinco minutos. Mantenha links e senhas privados e compartilhe as senhas separadamente.",
      "O prazo selecionado começa quando o envio termina. O acesso pelo link é recusado na expiração, mas o objeto armazenado pode ser removido depois, quando a tarefa de limpeza for executada.",
      "Para cada envio, guardamos no banco de dados o nome, tipo de conteúdo, tamanho, identificador, status, horários de envio/conclusão, expiração do link e hash da senha quando definida. Os metadados podem permanecer após a remoção do arquivo armazenado.",
      "Quando alguém baixa um arquivo, registramos o identificador, o horário do download, um hash com chave do IP do visitante e a string user-agent do navegador. Os registros e metadados são mantidos no banco de dados. As senhas não são armazenadas, mas guardamos um hash para verificar links protegidos.",
      "Ao usar o Linkify, você concorda com estes termos e com as leis locais ou regionais aplicáveis ao compartilhamento de arquivos e aos serviços on-line."
    ],
    ko: [
      "Linkify 홈", "기본 탐색", "사용 방법", "소개", "약관", "개인정보", "언어",
      "Linkify 소개", "대용량 파일도 간편하게.",
      "Linkify를 사용하면 계정을 만들거나 이메일 첨부 파일 용량 제한을 걱정하지 않고 파일을 쉽게 보낼 수 있습니다. 파일을 업로드하고 링크의 유효 기간을 선택한 뒤 필요한 사람과 공유하세요.",
      "설정 대신 간편한 공유",
      "최대 1GB 파일을 브라우저에서 비공개 저장소로 바로 업로드합니다. 연결이 끊기면 같은 브라우저에서 같은 파일을 다시 선택해 이어서 업로드할 수 있습니다. 업로드가 끝나면 생성된 링크를 공유하세요. 만료는 Linkify가 처리합니다.",
      "세심하게 준비한 추가 기능", "최대 1GB 전송", "메시지에 첨부하기 어려운 큰 파일을 공유하세요.",
      "업로드 이어 하기", "같은 브라우저에서 중단된 전송을 최대 7일 동안 이어서 진행하세요.",
      "계정 불필요", "가입이나 프로필 관리 없이 바로 공유를 시작하세요.",
      "링크 유효 기간 선택", "업로드 후 1시간, 하루 또는 일주일 뒤 링크가 만료되도록 설정하세요.",
      "선택적 비밀번호 확인", "접근 확인을 추가하세요. 비밀번호 보호는 파일 암호화가 아닙니다.",
      "비공개 저장소", "파일은 공개 객체로 게시되지 않으며 공유 링크를 통해 접근을 요청합니다.", "파일 공유",
      "빠른 안내", "파일에서 공유 링크까지.",
      "파일을 선택하고 옵션을 설정한 다음 링크 하나를 공유하세요. 계정이나 이메일 첨부가 필요하지 않습니다.",
      "간단한 세 단계", "01 / 선택", "최대 1GB 파일을 선택하세요. 업로드 영역으로 끌어 놓거나 찾아보면 됩니다.",
      "02 / 접근 설정", "만료 시간을 선택하고 원하면 링크에 비밀번호 확인을 추가하세요.",
      "03 / 공유", "업로드가 완료되면 링크를 복사해 받는 사람에게 보내세요.",
      "자주 묻는 질문", "대용량 파일은 어떻게 보내나요?",
      "업로드가 중단되면 어떻게 하나요?", "같은 브라우저 프로필로 돌아와 7일 이내에 같은 파일을 다시 선택하세요. 저장된 브라우저 데이터와 미완료 저장소 조각을 사용할 수 있으면 Linkify가 업로드를 이어서 진행할 수 있습니다.",
      "계정이 필요한가요?", "아니요. 가입하지 않고 파일을 업로드해 공유 링크를 만들 수 있습니다.",
      "비밀번호를 추가할 수 있나요?", "네. 업로드 전에 비밀번호 보호를 켜고 비밀번호를 설정하세요. 파일 접근을 확인하지만 파일을 암호화하지는 않으므로 비밀번호는 링크와 별도로 공유하세요.",
      "공유 링크는 얼마나 오래 유지되나요?",
      "1시간, 하루 또는 일주일을 선택하세요. 업로드가 끝난 뒤 카운트다운이 시작됩니다. 만료되면 Linkify가 공유 링크를 더 이상 받지 않습니다. 이미 발급된 저장소 URL은 최대 5분 동안 사용할 수 있습니다.",
      "링크로 파일을 다운로드할 수 있나요?", "네. 링크를 가진 사람은 유효 기간 동안 파일을 열 수 있습니다. 비밀번호 보호를 켰다면 비밀번호도 필요합니다.",
      "공유 시작",
      "Linkify / 개인정보", "개인정보 처리방침",
      "업로드한 파일은 비공개 Cloudflare R2 버킷에 보관되며 공개 객체로 게시되지 않습니다. Linkify를 통해 접근을 요청하려면 서명된 공유 링크가 필요합니다.",
      "비밀번호 보호",
      "비밀번호는 접근 확인 수단이지 암호화가 아닙니다. 비밀번호는 6~128자여야 합니다. Linkify는 단기 저장소 URL을 발급하기 전에 비밀번호를 확인하며 파일 자체는 종단 간 암호화되지 않습니다. 비밀번호는 공유 링크에 포함되지 않습니다. 데이터베이스에는 평문이 아닌 키가 적용된 HMAC-SHA-256 해시가 저장되며, Linkify는 확인 과정에서 비밀번호를 처리합니다. 비밀번호를 링크와 별도로 공유하고 고유하며 추측하기 어려운 비밀번호를 선택하세요.",
      "Linkify가 직접 저장소 URL을 발급하면 만료될 때까지 비밀번호를 다시 입력하지 않고 사용할 수 있으며, 발급 후 최대 5분까지 유효합니다. 링크를 취소하거나 상태를 바꾸더라도 이미 발급된 URL이나 누군가 다운로드한 파일을 회수할 수 없습니다.",
      "자동 만료",
      "선택한 1시간, 1일 또는 1주 유효 기간은 업로드가 성공적으로 완료된 뒤에만 시작됩니다. 만료 시점에 Linkify는 공유 링크를 더 이상 받지 않습니다. 서비스가 작동 중일 때 정리 작업이 객체를 삭제하며, 서비스가 유휴 상태에서 중지된 경우 실제 삭제는 다시 시작될 때까지 기다립니다. 따라서 링크 접근은 예정대로 만료되지만 저장소 삭제는 늦어질 수 있습니다.",
      "사이트 데이터가 보존되고 같은 파일을 다시 선택하면 같은 브라우저 프로필에서 중단된 업로드를 최대 7일 동안 재개할 수 있습니다. 미완료 조각은 이 기간 이후 설정된 저장소 수명 주기 규칙에 따라 삭제됩니다.",
      "보관하는 정보",
      "데이터베이스에 파일 내용은 저장하지 않습니다. 파일 식별자, 이름, 콘텐츠 유형, 크기, 업로드 상태, 타임스탬프, 만료 시간, 설정된 경우 비밀번호 해시, 다운로드 횟수 등의 파일 메타데이터를 보관합니다. 링크가 만료되고 정리 작업이 실행되면 파일 자체는 저장소에서 삭제됩니다.",
      "다운로드마다 파일 식별자, 시간, 방문자 IP 주소의 키 해시, 브라우저 user-agent 문자열을 기록합니다. 수동으로 삭제하지 않는 한 다운로드 로그와 파일 메타데이터는 데이터베이스에 남습니다.",
      "파일 공유 서비스는 사용자 콘텐츠를 처리하므로 업로드하고 공유하는 정보에 대한 책임은 사용자에게 있습니다. 선택한 보호 링크로 공유하려는 경우가 아니라면 개인정보나 민감한 문서를 업로드하지 마세요.",
      "앱으로 돌아가기",
      "Linkify / 약관", "서비스 이용약관",
      "Linkify를 사용하면 파일을 업로드하고 비공개 공유 링크를 만들며 원할 경우 비밀번호로 링크를 보호할 수 있습니다.",
      "업로드하는 파일과 공유 대상에 대한 책임은 사용자에게 있습니다. 법률을 위반하거나 타인의 권리를 침해하거나 악성코드 또는 악용 콘텐츠가 포함된 파일은 업로드하지 마세요.",
      "서비스는 있는 그대로 제공됩니다. 플랫폼을 악용하거나 유해한 콘텐츠를 포함하거나 정상 운영을 방해하는 링크는 정지 또는 삭제할 수 있습니다.",
      "파일은 비공개 객체 저장소 버킷에 저장됩니다. 비밀번호 보호는 접근 확인이며 암호화가 아닙니다. 서비스는 최대 5분 동안 사용할 수 있는 직접 저장소 URL을 발급하기 전에 비밀번호를 확인합니다. 공유 링크와 비밀번호를 비공개로 유지하고 비밀번호는 링크와 따로 공유하세요.",
      "선택한 링크 유효 기간은 업로드가 완료될 때 시작됩니다. 만료되면 링크 접근이 거부되지만 저장된 객체는 정리 작업이 실행된 뒤 삭제될 수 있습니다.",
      "각 업로드에 대해 파일 이름, 콘텐츠 유형, 크기, 파일 식별자, 상태, 업로드/완료 타임스탬프, 링크 만료 시간 및 설정된 경우 비밀번호 해시를 데이터베이스에 보관합니다. 저장 파일이 삭제된 뒤에도 메타데이터가 남을 수 있습니다.",
      "누군가 파일을 다운로드하면 파일 식별자, 다운로드 시간, 방문자 IP 주소의 키 해시, 브라우저 user-agent 문자열을 기록합니다. 다운로드 기록과 파일 메타데이터는 데이터베이스에 보관됩니다. 비밀번호 자체는 저장하지 않지만 보호된 링크 확인을 위해 해시를 보관합니다.",
      "Linkify를 사용하면 이 약관과 파일 공유 및 온라인 서비스에 적용되는 현지 또는 지역 법률에 동의하게 됩니다."
    ]
  };

  const metadata = {
    en: {
      about: ["About Linkify | Simple private file sharing", "Learn about Linkify, a simple way to share files up to 1 GB with private, expiring links."],
      how: ["How Linkify works | File sharing help", "Learn how to upload, resume, protect, and share files with Linkify."],
      privacy: ["Linkify — Privacy Policy", "Privacy policy for Linkify private file sharing."],
      terms: ["Linkify — Terms of Service", "Terms of service for Linkify private file sharing."]
    },
    es: {
      about: ["Acerca de Linkify | Comparte archivos de forma privada", "Conoce Linkify, una forma sencilla de compartir archivos de hasta 1 GB mediante enlaces privados que caducan."],
      how: ["Cómo funciona Linkify | Ayuda para compartir archivos", "Descubre cómo cargar, reanudar, proteger y compartir archivos con Linkify."],
      privacy: ["Linkify — Política de privacidad", "Política de privacidad para compartir archivos de forma privada con Linkify."],
      terms: ["Linkify — Términos del servicio", "Términos del servicio de intercambio privado de archivos de Linkify."]
    },
    fr: {
      about: ["À propos de Linkify | Partage privé de fichiers simple", "Découvrez Linkify, un moyen simple de partager en privé des fichiers jusqu’à 1 Go avec des liens à durée limitée."],
      how: ["Fonctionnement de Linkify | Aide au partage de fichiers", "Découvrez comment téléverser, reprendre, protéger et partager des fichiers avec Linkify."],
      privacy: ["Linkify — Politique de confidentialité", "Politique de confidentialité du service privé de partage de fichiers Linkify."],
      terms: ["Linkify — Conditions d’utilisation", "Conditions d’utilisation du service privé de partage de fichiers Linkify."]
    },
    de: {
      about: ["Über Linkify | Einfaches privates Teilen von Dateien", "Erfahren Sie mehr über Linkify, eine einfache Möglichkeit, Dateien bis 1 GB über private Links mit Ablaufzeit zu teilen."],
      how: ["So funktioniert Linkify | Hilfe zum Teilen von Dateien", "Erfahren Sie, wie Sie Dateien mit Linkify hochladen, fortsetzen, schützen und teilen."],
      privacy: ["Linkify — Datenschutzerklärung", "Datenschutzerklärung für das private Teilen von Dateien mit Linkify."],
      terms: ["Linkify — Nutzungsbedingungen", "Nutzungsbedingungen für das private Teilen von Dateien mit Linkify."]
    },
    ar: {
      about: ["حول Linkify | مشاركة الملفات الخاصة بسهولة", "تعرّف على Linkify، طريقة سهلة لمشاركة ملفات حتى 1 غيغابايت عبر روابط خاصة تنتهي صلاحيتها."],
      how: ["كيف يعمل Linkify | مساعدة مشاركة الملفات", "تعرّف على كيفية رفع الملفات واستئنافها وحمايتها ومشاركتها باستخدام Linkify."],
      privacy: ["Linkify — سياسة الخصوصية", "سياسة الخصوصية لمشاركة الملفات الخاصة عبر Linkify."],
      terms: ["Linkify — شروط الخدمة", "شروط خدمة مشاركة الملفات الخاصة عبر Linkify."]
    },
    hi: {
      about: ["Linkify के बारे में | आसान निजी फ़ाइल साझाकरण", "Linkify के बारे में जानें—निजी, समय-सीमा वाले लिंक से 1 GB तक की फ़ाइलें साझा करने का आसान तरीका।"],
      how: ["Linkify कैसे काम करता है | फ़ाइल साझा करने में सहायता", "जानें कि Linkify से फ़ाइलें कैसे अपलोड, फिर से शुरू, सुरक्षित और साझा करें।"],
      privacy: ["Linkify — गोपनीयता नीति", "Linkify की निजी फ़ाइल-साझाकरण सेवा के लिए गोपनीयता नीति।"],
      terms: ["Linkify — सेवा की शर्तें", "Linkify की निजी फ़ाइल-साझाकरण सेवा की शर्तें।"]
    },
    zh: {
      about: ["关于 Linkify | 简单的私人文件分享", "了解 Linkify：通过私密且限时的链接轻松分享最大 1 GB 的文件。"],
      how: ["Linkify 使用方法 | 文件分享帮助", "了解如何使用 Linkify 上传、续传、保护和分享文件。"],
      privacy: ["Linkify — 隐私政策", "Linkify 私人文件分享服务的隐私政策。"],
      terms: ["Linkify — 服务条款", "Linkify 私人文件分享服务条款。"]
    },
    tr: {
      about: ["Linkify hakkında | Kolay ve özel dosya paylaşımı", "Özel ve süreli bağlantılarla 1 GB'a kadar dosyaları paylaşmanın kolay yolu Linkify hakkında bilgi edinin."],
      how: ["Linkify nasıl çalışır? | Dosya paylaşım yardımı", "Linkify ile dosyaları yüklemeyi, sürdürmeyi, korumayı ve paylaşmayı öğrenin."],
      privacy: ["Linkify — Gizlilik Politikası", "Linkify özel dosya paylaşımına ilişkin gizlilik politikası."],
      terms: ["Linkify — Hizmet Koşulları", "Linkify özel dosya paylaşımına ilişkin hizmet koşulları."]
    },
    ja: {
      about: ["Linkifyについて | 簡単でプライベートなファイル共有", "Linkifyについてご紹介します。最大1 GBのファイルを期限付きの非公開リンクで簡単に共有できます。"],
      how: ["Linkifyの使い方 | ファイル共有ヘルプ", "Linkifyでファイルをアップロード、再開、保護、共有する方法をご案内します。"],
      privacy: ["Linkify — プライバシーポリシー", "Linkifyのプライベートファイル共有に関するプライバシーポリシー。"],
      terms: ["Linkify — 利用規約", "Linkifyのプライベートファイル共有に関する利用規約。"]
    },
    ru: {
      about: ["О Linkify | Простая приватная передача файлов", "Узнайте о Linkify — простом способе делиться файлами до 1 ГБ по закрытым ссылкам с ограниченным сроком действия."],
      how: ["Как работает Linkify | Помощь по обмену файлами", "Узнайте, как загружать, возобновлять, защищать и передавать файлы с помощью Linkify."],
      privacy: ["Linkify — Политика конфиденциальности", "Политика конфиденциальности сервиса приватной передачи файлов Linkify."],
      terms: ["Linkify — Условия использования", "Условия использования сервиса приватной передачи файлов Linkify."]
    },
    pt: {
      about: ["Sobre o Linkify | Compartilhamento privado e simples", "Conheça o Linkify, uma maneira simples de compartilhar arquivos de até 1 GB com links privados e temporários."],
      how: ["Como o Linkify funciona | Ajuda para compartilhar arquivos", "Saiba como enviar, retomar, proteger e compartilhar arquivos com o Linkify."],
      privacy: ["Linkify — Política de Privacidade", "Política de privacidade do serviço privado de compartilhamento de arquivos Linkify."],
      terms: ["Linkify — Termos de Serviço", "Termos de serviço do compartilhamento privado de arquivos do Linkify."]
    },
    ko: {
      about: ["Linkify 소개 | 간편한 비공개 파일 공유", "Linkify를 알아보세요. 비공개 만료 링크로 최대 1GB 파일을 간편하게 공유할 수 있습니다."],
      how: ["Linkify 사용 방법 | 파일 공유 도움말", "Linkify로 파일을 업로드하고 이어서 진행하며 보호하고 공유하는 방법을 알아보세요."],
      privacy: ["Linkify — 개인정보 처리방침", "Linkify 비공개 파일 공유 서비스의 개인정보 처리방침입니다."],
      terms: ["Linkify — 서비스 이용약관", "Linkify 비공개 파일 공유 서비스의 이용약관입니다."]
    }
  };

  const locales = ["en", ...Object.keys(localized)];
  const lookup = {};
  lookup.en = {};
  Object.keys(localized).forEach((locale) => {
    lookup[locale] = {};
    keys.forEach((key, index) => {
      lookup[locale][key] = localized[locale][index];
    });
  });

  const faqAnswer = {
    es: 'Elige o suelta un archivo de hasta 1 GB en la <a href="/">página de carga de Linkify</a>. Cuando termine la carga, copia el enlace generado y compártelo con quien lo recibirá.',
    fr: 'Choisissez ou déposez un fichier jusqu’à 1 Go sur la <a href="/">page de téléversement Linkify</a>. Une fois le téléversement terminé, copiez le lien généré et partagez-le avec votre destinataire.',
    de: 'Wählen Sie eine Datei bis 1 GB aus oder legen Sie sie auf der <a href="/">Linkify-Uploadseite</a> ab. Kopieren Sie nach dem Upload den erzeugten Link und teilen Sie ihn mit dem Empfänger.',
    ar: 'اختر ملفًا أو أسقطه في <a href="/">صفحة الرفع في Linkify</a>، حتى 1 غيغابايت. بعد اكتمال الرفع، انسخ الرابط الذي أُنشئ وشاركه مع المستلم.',
    hi: '<a href="/">Linkify अपलोड पेज</a> पर 1 GB तक की फ़ाइल चुनें या छोड़ें। अपलोड पूरा होने पर बना लिंक कॉपी करें और पाने वाले के साथ साझा करें।',
    zh: '在 <a href="/">Linkify 上传页面</a>选择或拖入最大 1 GB 的文件。上传完成后，复制生成的链接并分享给接收者。',
    tr: '<a href="/">Linkify yükleme sayfasında</a> 1 GB’a kadar bir dosya seçin veya bırakın. Yükleme bitince oluşturulan bağlantıyı kopyalayıp alıcıyla paylaşın.',
    ja: '<a href="/">Linkifyのアップロードページ</a>で最大1 GBのファイルを選択するか、ドロップしてください。アップロード後、生成されたリンクをコピーして相手に共有します。',
    ru: 'Выберите файл размером до 1 ГБ или перетащите его на <a href="/">страницу загрузки Linkify</a>. После загрузки скопируйте созданную ссылку и отправьте получателю.',
    pt: 'Escolha ou solte um arquivo de até 1 GB na <a href="/">página de envio do Linkify</a>. Quando o envio terminar, copie o link gerado e compartilhe-o com o destinatário.',
    ko: '<a href="/">Linkify 업로드 페이지</a>에서 최대 1GB 파일을 선택하거나 끌어 놓으세요. 업로드가 끝나면 생성된 링크를 복사해 받는 사람과 공유하세요.'
  };

  const page = location.pathname.endsWith("/about.html") ? "about"
    : location.pathname.endsWith("/how-it-works.html") ? "how"
      : location.pathname.endsWith("/privacy.html") ? "privacy"
        : location.pathname.endsWith("/terms.html") ? "terms" : null;
  if (!page) return;

  const themeLabels = {
    en: ["Switch to dark mode", "Switch to light mode"],
    es: ["Cambiar al modo oscuro", "Cambiar al modo claro"],
    fr: ["Activer le mode sombre", "Activer le mode clair"],
    de: ["Dunkelmodus aktivieren", "Hellmodus aktivieren"],
    ar: ["التبديل إلى الوضع الداكن", "التبديل إلى الوضع الفاتح"],
    hi: ["डार्क मोड चालू करें", "लाइट मोड चालू करें"],
    zh: ["切换到深色模式", "切换到浅色模式"],
    tr: ["Koyu moda geç", "Açık moda geç"],
    ja: ["ダークモードに切り替え", "ライトモードに切り替え"],
    ru: ["Включить тёмную тему", "Включить светлую тему"],
    pt: ["Ativar modo escuro", "Ativar modo claro"],
    ko: ["다크 모드로 전환", "라이트 모드로 전환"]
  };

  const themeButton = document.createElement("button");
  themeButton.type = "button";
  themeButton.className = "theme-toggle";
  themeButton.addEventListener("click", () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(theme, true);
    updateThemeButton(language);
  });
  const controls = document.querySelector(".static-language-control");
  if (controls) controls.insertBefore(themeButton, controls.firstChild);

  function applyTheme(theme, persist) {
    document.documentElement.dataset.theme = theme;
    if (persist) {
      try {
        localStorage.setItem("linkify-theme", theme);
      } catch {
        // The current page still changes theme when browser storage is unavailable.
      }
    }
  }

  function updateThemeButton(locale) {
    const dark = document.documentElement.dataset.theme === "dark";
    themeButton.textContent = dark ? "☀" : "☾";
    themeButton.title = themeLabels[locale][dark ? 1 : 0];
    themeButton.setAttribute("aria-label", themeButton.title);
    themeButton.setAttribute("aria-pressed", String(dark));
  }

  let language = "en";
  try {
    const saved = localStorage.getItem("linkify-language");
    if (locales.includes(saved)) language = saved;
  } catch {
    // Storage can be disabled or unavailable in some browsing contexts.
  }

  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  try {
    applyTheme(localStorage.getItem("linkify-theme") === "dark" ? "dark" : "light", false);
  } catch {
    applyTheme("light", false);
  }
  const selector = document.getElementById("language-select");
  if (selector) selector.value = language;
  updateThemeButton(language);

  const applyLanguage = (nextLanguage, persist) => {
    const next = locales.includes(nextLanguage) ? nextLanguage : "en";
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    const pageMetadata = metadata[next][page];
    document.title = pageMetadata[0];
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = pageMetadata[1];
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = pageMetadata[0];
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.content = pageMetadata[1];

    const dictionary = lookup[next];
    document.body.querySelectorAll("*").forEach((element) => {
      if (element.hasAttribute("data-i18n-html")) return;
      if (!element.hasAttribute("data-i18n-original-text")) {
        element.setAttribute("data-i18n-original-text", element.textContent);
      }
      const originalText = element.getAttribute("data-i18n-original-text");
      if (!element.children.length) {
        const key = originalText.trim();
        element.textContent = dictionary[key] || originalText;
      }
      if (element.hasAttribute("aria-label")) {
        if (!element.hasAttribute("data-i18n-original-label")) {
          element.setAttribute("data-i18n-original-label", element.getAttribute("aria-label"));
        }
        const label = element.getAttribute("data-i18n-original-label");
        element.setAttribute("aria-label", dictionary[label] || label);
      }
    });
    const linkedAnswer = document.querySelector('[data-i18n-html="how-send-large"]');
    if (linkedAnswer) {
      if (!linkedAnswer.hasAttribute("data-i18n-original-html")) {
        linkedAnswer.setAttribute("data-i18n-original-html", linkedAnswer.innerHTML);
      }
      linkedAnswer.innerHTML = next === "en" ? linkedAnswer.getAttribute("data-i18n-original-html") : faqAnswer[next];
    }
    if (selector) selector.value = next;
    updateThemeButton(next);
    if (persist) {
      try {
        localStorage.setItem("linkify-language", next);
      } catch {
        // The page still changes language when preference storage is unavailable.
      }
    }
  };

  applyLanguage(language, false);
  if (selector) selector.addEventListener("change", () => applyLanguage(selector.value, true));
})();
