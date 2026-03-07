import React, { useEffect } from 'react';
import { Document, Image, Page, PDFViewer, Text, View } from '@react-pdf/renderer';
import {Table, TR, TH, TD} from '@ag-media/react-pdf-table';
import { styles } from './Style';
import Ganapati from '../assets/Bappa.png'
import LaxmiMata from '../assets/LaxmiMata.jpeg'

const InvoicePDF = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Image src={Ganapati} style={styles.image}></Image>

                <View style={styles.titleHeading}>
                    <View style={styles.title}>
                        <Text>||श्री गणेश मित्र मंडळ||</Text>
                    </View>
                    <View style={styles.mantra}>
                        <Text>
                            ||वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ
                        </Text>
                        <Text>  
                            निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा||
                        </Text>
                    </View>
                </View>

                <Image src={LaxmiMata} style={styles.image}></Image>
            </View>

            <View style={styles.content}>
                <View style={styles.userDetails}>
                    <Text style={styles.contentList}>पत्ता : समता चौक माळी गल्ली, भिंगार, अहिल्यानगर, ४१४००२</Text>
                    <Text style={styles.contentList}></Text>
                </View>
            </View>

            <Table>
                <TH>
                    <TD>नाव</TD>
                    <TD>मोबाईल नंबर</TD>
                    <TD>Receipt No</TD>
                    <TD>Date</TD>
                    <TD>Amount</TD>
                </TH>
                <TR>
                    <TD>Data 1</TD>
                    <TD>Data 2</TD>
                    <TD>Data 2</TD>
                    <TD>Data 2</TD>
                    <TD>Data 2</TD>
                </TR>
            </Table>
        </Page>
    </Document>
);

// const Invoice = () => {
//   return (
//     <PDFViewer style={{ width: '100%', height: '100vh' }}>
//       <InvoicePDF />
//     </PDFViewer>
//   );
// };

// const generatePDFBlob = async () => {
//   const blob = await pdf(<InvoicePDF />).toBlob();
//   return blob;
// };

// useEffect(async () => {
//   const pdfBlob = await generatePDFBlob();
//   console.log(pdfBlob);
// })

export default InvoicePDF;
