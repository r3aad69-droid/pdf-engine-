const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.get('/generate-pdf', async (req, res) => {
    const { name, amount, date, appt } = req.query;
    
    const htmlContent = `
    <html>
    <body style="font-family:sans-serif; padding:50px; background:white; color:black;">
        <div style="border:5px solid black; padding:30px; text-align:center;">
            <h1 style="font-size:40px; margin-bottom:10px;">RÉSIDENCE OUERFELLI</h1>
            <p style="font-size:18px; letter-spacing:2px;">SILIANA, TUNISIE</p>
            <hr style="border:2px solid black; margin:30px 0;">
            <div style="text-align:left; font-size:20px; line-height:2;">
                <p><b>LOCATAIRE :</b> ${name || 'Client'}</p>
                <p><b>APPARTEMENT :</b> ${appt || 'N/A'}</p>
                <p><b>DATE :</b> ${date || 'Non spécifiée'}</p>
            </div>
            <div style="margin-top:40px; border:4px solid black; padding:20px; font-size:35px; font-weight:900;">
                TOTAL : ${amount || '0'} DT
            </div>
            <p style="margin-top:60px; text-align:right; font-weight:bold; font-size:18px;">Signature & Cachet</p>
        </div>
    </body>
    </html>`;

    try {
        const browser = await puppeteer.launch({ 
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        const pdf = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();
        res.contentType("application/pdf");
        res.send(pdf);
    } catch (e) {
        res.status(500).send("Erreur : " + e.message);
    }
});

app.listen(process.env.PORT || 3000);
