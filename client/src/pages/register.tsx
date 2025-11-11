"use client";

import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { UserPlus, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const { register } = useAuth();
  const navigate = useNavigate();

  // Real-time password validation
  const validatePassword = (pwd: string): string | null => {
    if (pwd.length === 0) return null;
    if (pwd.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(pwd)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(pwd)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  // Email validation
  const validateEmail = (email: string): string | null => {
    if (email.length === 0) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email address";
    }
    return null;
  };

  // Name validation
  const validateName = (name: string): string | null => {
    if (name.length === 0) return null;
    if (name.length < 2) {
      return "Name must be at least 2 characters long";
    }
    if (name.length > 50) {
      return "Name cannot exceed 50 characters";
    }
    return null;
  };

  // Confirm password validation
  const validateConfirmPassword = (pwd: string, confirmPwd: string): string | null => {
    if (confirmPwd.length === 0) return null;
    if (pwd !== confirmPwd) {
      return "Passwords do not match";
    }
    return null;
  };

  // Handle changes with real-time validation
  const handleNameChange = (value: string) => {
    setName(value);
    const error = validateName(value);
    setValidationErrors(prev => ({ ...prev, name: error || undefined }));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const error = validateEmail(value);
    setValidationErrors(prev => ({ ...prev, email: error || undefined }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const error = validatePassword(value);
    setValidationErrors(prev => ({ ...prev, password: error || undefined }));
    
    // Revalidate confirmation if it already exists
    if (confirmPassword) {
      const confirmError = validateConfirmPassword(value, confirmPassword);
      setValidationErrors(prev => ({ ...prev, confirmPassword: confirmError || undefined }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    const error = validateConfirmPassword(password, value);
    setValidationErrors(prev => ({ ...prev, confirmPassword: error || undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Final validation before submission
    const errors: ValidationErrors = {};
    
    const nameError = validateName(name);
    if (nameError) errors.name = nameError;

    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError("Please correct the errors in the form");
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate("/login");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center animate-fade-in-down">
          <UserPlus className="mx-auto h-12 w-12 text-sage" />
          <h2 className="mt-6 font-playfair text-3xl font-bold text-anthracite">
            Join BlogCraft
          </h2>
          <p className="mt-2 text-sm text-anthracite/70">
            Create your account and start sharing your stories
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-sage/20 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="font-playfair text-2xl text-center text-anthracite">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-anthracite/70">
              Fill in your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-anthracite font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className={`border-sage/30 focus:border-sage focus:ring-sage ${
                    validationErrors.name ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your full name"
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-anthracite font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  required
                  className={`border-sage/30 focus:border-sage focus:ring-sage ${
                    validationErrors.email ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your email"
                />
                {validationErrors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-anthracite font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    required
                    className={`border-sage/30 focus:border-sage focus:ring-sage pr-10 ${
                      validationErrors.password ? "border-red-500" : ""
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-anthracite/50 hover:text-anthracite"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.password}
                  </p>
                )}
                {!validationErrors.password && password.length > 0 && (
                  <p className="text-xs text-anthracite/60">
                    Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-anthracite font-medium"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    required
                    className={`border-sage/30 focus:border-sage focus:ring-sage pr-10 ${
                      validationErrors.confirmPassword ? "border-red-500" : ""
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-anthracite/50 hover:text-anthracite"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-sage hover:bg-sage/90 text-white py-2 px-4 rounded-md transition-colors"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-anthracite/70">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-sage hover:text-sage/80 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}