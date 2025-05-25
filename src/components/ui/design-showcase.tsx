import React from 'react'
import { Button } from './button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
import { Alert, AlertDescription, AlertTitle } from './alert'
import { ExclamationTriangleIcon, CheckCircledIcon, InfoCircledIcon } from '@radix-ui/react-icons'

/**
 * A showcase component demonstrating the new design tokens and styling capabilities
 * This can be used as a reference for developers to see the available design options
 */
export function DesignShowcase() {
  return (
    <div className="space-y-12 p-6 max-w-6xl mx-auto">
      {/* Typography Section */}
      <section className="space-y-4">
        <h2 className="text-h2 gradient-text">Typography</h2>
        <div className="grid gap-4">
          <h1>Heading 1 - Fluid Typography</h1>
          <h2>Heading 2 - Fluid Typography</h2>
          <h3>Heading 3 - Fluid Typography</h3>
          <p>Body text - This is a paragraph with fluid typography that adjusts based on viewport size.</p>
          <small>Small text - Also using fluid typography for better readability.</small>
          <p className="gradient-text font-semibold text-xl">Gradient Text Example</p>
        </div>
      </section>

      {/* Buttons Section */}
      <section className="space-y-4">
        <h2 className="text-h2 gradient-text">Buttons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Button variant="default">Default Button</Button>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="accent">Accent Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
          <Button variant="glass">Glass Button</Button>
          <Button variant="glass-primary">Glass Primary</Button>
          <Button variant="glass-accent">Glass Accent</Button>
          <Button variant="gradient">Gradient Button</Button>
        </div>
        
        <h3 className="text-h3 mt-6">Button Animations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Button variant="primary" animation="fade-in">Fade In</Button>
          <Button variant="accent" animation="fade-up">Fade Up</Button>
          <Button variant="secondary" animation="slide-in">Slide In</Button>
          <Button variant="default" animation="float">Float</Button>
          <Button variant="outline" animation="pulse">Pulse</Button>
        </div>
        
        <h3 className="text-h3 mt-6">Button Shadows</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Button variant="primary" shadow="sm">Shadow Small</Button>
          <Button variant="primary" shadow="DEFAULT">Shadow Default</Button>
          <Button variant="primary" shadow="md">Shadow Medium</Button>
          <Button variant="primary" shadow="lg">Shadow Large</Button>
          <Button variant="primary" shadow="primary-sm">Primary Shadow S</Button>
          <Button variant="primary" shadow="primary-md">Primary Shadow M</Button>
          <Button variant="primary" shadow="primary-lg">Primary Shadow L</Button>
          <Button variant="accent" shadow="accent-md">Accent Shadow</Button>
        </div>
        
        <h3 className="text-h3 mt-6">Button Sizes</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="default">Default</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" size="xl">Extra Large</Button>
          <Button variant="primary" size="icon">
            <CheckCircledIcon className="h-4 w-4" />
          </Button>
          <Button variant="primary" size="icon-sm">
            <CheckCircledIcon className="h-4 w-4" />
          </Button>
          <Button variant="primary" size="icon-lg">
            <CheckCircledIcon className="h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* Cards Section */}
      <section className="space-y-4">
        <h2 className="text-h2 gradient-text">Cards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>This is a default card with no special styling</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Cards can contain any content and are styled with the new design tokens.</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>
          
          <Card variant="primary" shadow="primary-sm">
            <CardHeader>
              <CardTitle>Primary Card</CardTitle>
              <CardDescription>Primary themed card with shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card uses the primary color palette and has a matching shadow.</p>
            </CardContent>
            <CardFooter>
              <Button variant="primary">Action</Button>
            </CardFooter>
          </Card>
          
          <Card variant="accent" shadow="accent-sm">
            <CardHeader>
              <CardTitle>Accent Card</CardTitle>
              <CardDescription>Accent themed card with shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card uses the accent color palette and has a matching shadow.</p>
            </CardContent>
            <CardFooter>
              <Button variant="accent">Action</Button>
            </CardFooter>
          </Card>
          
          <Card variant="glass" animation="fade-up">
            <CardHeader>
              <CardTitle>Glass Card</CardTitle>
              <CardDescription>With glassmorphism effect and animation</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card uses the glass effect for a modern UI look with fade-up animation.</p>
            </CardContent>
            <CardFooter>
              <Button variant="glass">Action</Button>
            </CardFooter>
          </Card>
          
          <Card variant="glass-primary" hover="scale" shadow="md">
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>With hover effects and shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card scales on hover and has a medium shadow for depth.</p>
            </CardContent>
            <CardFooter>
              <Button variant="glass-primary">Action</Button>
            </CardFooter>
          </Card>
          
          <Card variant="gradient" hover="brightness" animation="fade-in">
            <CardHeader>
              <CardTitle className="text-white">Gradient Card</CardTitle>
              <CardDescription className="text-white/80">With gradient background</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">This card uses a gradient background with brightness hover effect.</p>
            </CardContent>
            <CardFooter>
              <Button variant="glass" className="text-white border-white/20">Action</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Alerts Section */}
      <section className="space-y-4">
        <h2 className="text-h2 gradient-text">Alerts</h2>
        <div className="grid grid-cols-1 gap-4">
          <Alert>
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>This is a default alert with no special styling.</AlertDescription>
          </Alert>
          
          <Alert variant="primary" shadow="primary-sm" animation="fade-in">
            <CheckCircledIcon className="h-4 w-4" />
            <AlertTitle>Primary Alert</AlertTitle>
            <AlertDescription>This is a primary alert with shadow and fade-in animation.</AlertDescription>
          </Alert>
          
          <Alert variant="success" shadow="sm">
            <CheckCircledIcon className="h-4 w-4" />
            <AlertTitle>Success Alert</AlertTitle>
            <AlertDescription>This is a success alert with small shadow.</AlertDescription>
          </Alert>
          
          <Alert variant="warning" animation="pulse-border">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Warning Alert</AlertTitle>
            <AlertDescription>This is a warning alert with pulsing border animation.</AlertDescription>
          </Alert>
          
          <Alert variant="info" shadow="elevation">
            <InfoCircledIcon className="h-4 w-4" />
            <AlertTitle>Info Alert</AlertTitle>
            <AlertDescription>This is an info alert with elevation shadow.</AlertDescription>
          </Alert>
          
          <Alert variant="destructive" animation="slide-in">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Destructive Alert</AlertTitle>
            <AlertDescription>This is a destructive alert with slide-in animation.</AlertDescription>
          </Alert>
          
          <Alert variant="glass" shadow="md">
            <InfoCircledIcon className="h-4 w-4" />
            <AlertTitle>Glass Alert</AlertTitle>
            <AlertDescription>This is a glass alert with medium shadow for a modern look.</AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Glassmorphism Section */}
      <section className="space-y-4">
        <h2 className="text-h2 gradient-text">Glassmorphism</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative">
          {/* Background elements for demonstrating glassmorphism effect */}
          <div className="absolute -z-10 top-10 left-10 w-32 h-32 rounded-full bg-primary-500/30 blur-xl"></div>
          <div className="absolute -z-10 top-20 right-20 w-40 h-40 rounded-full bg-accent-500/30 blur-xl"></div>
          <div className="absolute -z-10 bottom-10 left-1/3 w-36 h-36 rounded-full bg-secondary-500/30 blur-xl"></div>
          
          <div className="glass p-6 rounded-lg">
            <h3 className="text-h3 mb-2">Glass Default</h3>
            <p>Basic glassmorphism effect with default settings.</p>
          </div>
          
          <div className="glass-sm p-6 rounded-lg">
            <h3 className="text-h3 mb-2">Glass Small</h3>
            <p>Lighter glassmorphism effect with less blur.</p>
          </div>
          
          <div className="glass-lg p-6 rounded-lg">
            <h3 className="text-h3 mb-2">Glass Large</h3>
            <p>Stronger glassmorphism effect with more blur and opacity.</p>
          </div>
          
          <div className="glass-primary p-6 rounded-lg">
            <h3 className="text-h3 mb-2">Glass Primary</h3>
            <p>Glassmorphism with primary color tint.</p>
          </div>
          
          <div className="glass-accent p-6 rounded-lg">
            <h3 className="text-h3 mb-2">Glass Accent</h3>
            <p>Glassmorphism with accent color tint.</p>
          </div>
          
          <div className="glass-secondary p-6 rounded-lg">
            <h3 className="text-h3 mb-2">Glass Secondary</h3>
            <p>Glassmorphism with secondary color tint.</p>
          </div>
        </div>
      </section>

      {/* Shadows Section */}
      <section className="space-y-4">
        <h2 className="text-h2 gradient-text">Shadows</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-h3 mb-2">Shadow Small</h3>
            <p>Subtle shadow for minimal depth.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow">
            <h3 className="text-h3 mb-2">Shadow Default</h3>
            <p>Default shadow for general use.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-h3 mb-2">Shadow Medium</h3>
            <p>Medium shadow for more emphasis.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <h3 className="text-h3 mb-2">Shadow Large</h3>
            <p>Large shadow for significant depth.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-xl">
            <h3 className="text-h3 mb-2">Shadow XL</h3>
            <p>Extra large shadow for maximum depth.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-elevation-1">
            <h3 className="text-h3 mb-2">Elevation 1</h3>
            <p>Custom elevation shadow level 1.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-elevation-3">
            <h3 className="text-h3 mb-2">Elevation 3</h3>
            <p>Custom elevation shadow level 3.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-elevation-5">
            <h3 className="text-h3 mb-2">Elevation 5</h3>
            <p>Custom elevation shadow level 5.</p>
          </div>
          
          <div className="bg-primary-50 p-6 rounded-lg shadow-primary-sm">
            <h3 className="text-h3 mb-2">Primary Shadow S</h3>
            <p>Small shadow with primary color.</p>
          </div>
          
          <div className="bg-primary-50 p-6 rounded-lg shadow-primary-md">
            <h3 className="text-h3 mb-2">Primary Shadow M</h3>
            <p>Medium shadow with primary color.</p>
          </div>
          
          <div className="bg-accent-50 p-6 rounded-lg shadow-accent-sm">
            <h3 className="text-h3 mb-2">Accent Shadow S</h3>
            <p>Small shadow with accent color.</p>
          </div>
          
          <div className="bg-accent-50 p-6 rounded-lg shadow-accent-md">
            <h3 className="text-h3 mb-2">Accent Shadow M</h3>
            <p>Medium shadow with accent color.</p>
          </div>
        </div>
      </section>

      {/* Animations Section */}
      <section className="space-y-4">
        <h2 className="text-h2 gradient-text">Animations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg animate-fade-in">
            <h3 className="text-h3 mb-2">Fade In</h3>
            <p>Simple fade in animation.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg animate-fade-up">
            <h3 className="text-h3 mb-2">Fade Up</h3>
            <p>Fade in from bottom animation.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg animate-slide-in">
            <h3 className="text-h3 mb-2">Slide In</h3>
            <p>Slide in from left animation.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg animate-float">
            <h3 className="text-h3 mb-2">Float</h3>
            <p>Gentle floating animation.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border-2 border-primary-500 animate-pulse-border">
            <h3 className="text-h3 mb-2">Pulse Border</h3>
            <p>Pulsing border animation.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-shimmer animate-shimmer"></div>
            <div className="relative z-10">
              <h3 className="text-h3 mb-2">Shimmer</h3>
              <p>Shimmering effect animation.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
