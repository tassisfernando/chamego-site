import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AppBar,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { NavLink, Route, Routes } from 'react-router-dom'
import { z } from 'zod'
import { fetchProducts } from './services/api'
import { useUiStore } from './store/useUiStore'

const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres.'),
  email: z.email('Informe um e-mail válido.'),
  message: z.string().min(10, 'A mensagem precisa ter ao menos 10 caracteres.'),
})

function HomePage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h1" fontWeight={700}>
        Chamego Site
      </Typography>
      <Typography variant="h6" color="text.secondary">
        Base React moderna para iniciar um sistema completo e responsivo com arquitetura simples.
      </Typography>
      <Grid container spacing={2}>
        {[
          'React 19 + Vite',
          'Roteamento com React Router',
          'Estado global com Zustand',
          'Dados com Axios + React Query',
          'Formulários com React Hook Form + Zod',
          'UI responsiva com Material UI',
        ].map((feature) => (
          <Grid key={feature} size={{ xs: 12, sm: 6 }}>
            <Card>
              <CardContent>
                <Typography fontWeight={600}>{feature}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}

function ProductsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  if (isLoading) {
    return <CircularProgress aria-label="Carregando produtos" />
  }

  if (isError) {
    return <Alert severity="error">Não foi possível carregar os produtos.</Alert>
  }

  return (
    <Grid container spacing={2}>
      {data.map((product) => (
        <Grid key={product.id} size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {product.title}
              </Typography>
              <Typography color="text.secondary">{product.description}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

function ContactPage() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 500)
    })

    setSent(true)
    reset()
  }

  return (
    <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
      {sent && <Alert severity="success">Mensagem enviada com sucesso!</Alert>}
      <TextField
        label="Nome"
        error={Boolean(errors.name)}
        helperText={errors.name?.message}
        {...register('name')}
      />
      <TextField
        label="E-mail"
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
        {...register('email')}
      />
      <TextField
        label="Mensagem"
        multiline
        minRows={4}
        error={Boolean(errors.message)}
        helperText={errors.message?.message}
        {...register('message')}
      />
      <Box>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </Button>
      </Box>
    </Stack>
  )
}

const links = [
  { to: '/', label: 'Início' },
  { to: '/produtos', label: 'Produtos' },
  { to: '/contato', label: 'Contato' },
]

function App() {
  const isDarkMode = useUiStore((state) => state.isDarkMode)
  const toggleTheme = useUiStore((state) => state.toggleTheme)

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Chamego
          </Typography>
          {links.map((link) => (
            <Button
              key={link.to}
              component={NavLink}
              to={link.to}
              color="inherit"
              sx={{ '&.active': { fontWeight: 700, textDecoration: 'underline' } }}
            >
              {link.label}
            </Button>
          ))}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="caption">Tema</Typography>
            <Switch checked={isDarkMode} onChange={toggleTheme} />
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/contato" element={<ContactPage />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
