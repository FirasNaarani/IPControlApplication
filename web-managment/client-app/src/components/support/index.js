import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import FirasPic from "./pics/firas.jpg";
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Home() {
  return (
    <Box>
      <Container fixed>
        <center>
          <Grid container spacing={12}>
            <Grid item xs>
              <Card sx={{ maxWidth: 345 }}>
                <Paper variant="outlined">
                  <CardMedia
                    component="img"
                    height="350"
                    image={FirasPic}
                    alt="Eng.Firas Naarani"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      👨🏻‍💻🔹 Firas Naarani 🔹👨🏻‍💻
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <center>
                      <table>
                        <tr>
                          <td className="aboutme" colSpan="4">
                            🔘 | Software Engineer 💻
                          </td>
                          <td>
                            <Button size="small" href="mailto:firas.narani.1999@gmail.com"><EmailIcon /></Button>
                          </td>
                        </tr>
                        <tr>
                          <td><Button size="small" target="_blank" rel="noopener noreferrer" href="https://wa.me/+972522918291"><WhatsAppIcon /></Button></td>
                          <td><Button size="small" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/Firas1Naarani/"><FacebookIcon/></Button></td>
                          <td><Button size="small" target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/firas_naarani/"><InstagramIcon/></Button></td>
                          <td><Button size="small" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/firas-naarani-961914225"><LinkedInIcon/></Button></td>
                          <td><Button size="small" target="_blank" rel="noopener noreferrer" href="https://github.com/FirasNaarani"><GitHubIcon/></Button></td>
                        </tr>
                      </table>
                    </center>
                  </CardActions>
                </Paper>
              </Card>
            </Grid>
          </Grid>
      
        </center>
      </Container>
    </Box>
    
  );
}