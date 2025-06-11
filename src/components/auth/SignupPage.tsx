
import { useState } from 'react'; // #signup
import { Button } from '@/components/ui/button'; // #signup
import { Input } from '@/components/ui/input'; // #signup
import { Label } from '@/components/ui/label'; // #signup
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // #signup
import { Checkbox } from '@/components/ui/checkbox'; // #signup
import { Eye, EyeOff, Truck } from 'lucide-react'; // #signup
import { Link } from 'react-router-dom'; // #routing

interface SignupPageProps { // #signup
  onSignup: (username: string, email: string, password: string, consent: boolean) => Promise<boolean>; // #signup
}

const SignupPage = ({ onSignup }: SignupPageProps) => { // #signup
  const [username, setUsername] = useState(''); // #signup
  const [email, setEmail] = useState(''); // #signup
  const [password, setPassword] = useState(''); // #signup
  const [confirmPassword, setConfirmPassword] = useState(''); // #signup
  const [consent, setConsent] = useState(false); // #signup
  const [showPassword, setShowPassword] = useState(false); // #signup
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // #signup
  const [isLoading, setIsLoading] = useState(false); // #signup
  const [error, setError] = useState(''); // #signup

  const handleSubmit = async (e: React.FormEvent) => { // #signup
    e.preventDefault(); // #signup
    setError(''); // #signup

    // #signup - Check if consent is checked
    if (!consent) { // #signup
      setError('Please click to consent to the terms and conditions.'); // #signup
      return; // #signup
    }

    // #signup - Check if passwords match
    if (password !== confirmPassword) { // #signup
      setError('Passwords do not match.'); // #signup
      return; // #signup
    }

    setIsLoading(true); // #signup

    try { // #signup
      const success = await onSignup(username, email, password, consent); // #signup
      if (!success) { // #signup
        setError('Signup failed. Please try again.'); // #signup
      }
    } catch (err) { // #signup
      setError('Signup failed. Please check your connection and try again.'); // #signup
    } finally { // #signup
      setIsLoading(false); // #signup
    }
  };

  return ( // #signup
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex items-center justify-center p-4"> {/* #signup */}
      <div  // #signup
        className="absolute inset-0 opacity-20" // #signup
        style={{ // #signup
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` // #signup
        }}
      />
      
      <div className="relative z-10 w-full max-w-md animate-fade-in"> {/* #signup */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm"> {/* #signup */}
          <CardHeader className="text-center space-y-4 pb-6"> {/* #signup */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"> {/* #signup */}
              <Truck className="h-8 w-8 text-white" /> {/* #signup */}
            </div>
            <div className="space-y-2"> {/* #signup */}
              <CardTitle className="text-2xl font-bold text-slate-800">Create Account</CardTitle> {/* #signup */}
              <CardDescription className="text-slate-600"> {/* #signup */}
                Join Fleet Insight Enterprise Management
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6"> {/* #signup */}
            <form onSubmit={handleSubmit} className="space-y-4"> {/* #signup */}
              <div className="space-y-2"> {/* #signup */}
                <Label htmlFor="username" className="text-slate-700 font-medium"> {/* #signup */}
                  Username
                </Label>
                <Input // #signup
                  id="username" // #signup
                  type="text" // #signup
                  placeholder="Enter your username" // #signup
                  value={username} // #signup
                  onChange={(e) => setUsername(e.target.value)} // #signup
                  className="h-11 border-slate-200 focus:border-teal-500 focus:ring-teal-500" // #signup
                  required // #signup
                />
              </div>

              <div className="space-y-2"> {/* #signup */}
                <Label htmlFor="email" className="text-slate-700 font-medium"> {/* #signup */}
                  Email
                </Label>
                <Input // #signup
                  id="email" // #signup
                  type="email" // #signup
                  placeholder="Enter your email" // #signup
                  value={email} // #signup
                  onChange={(e) => setEmail(e.target.value)} // #signup
                  className="h-11 border-slate-200 focus:border-teal-500 focus:ring-teal-500" // #signup
                  required // #signup
                />
              </div>

              <div className="space-y-2"> {/* #signup */}
                <Label htmlFor="password" className="text-slate-700 font-medium"> {/* #signup */}
                  Password
                </Label>
                <div className="relative"> {/* #signup */}
                  <Input // #signup
                    id="password" // #signup
                    type={showPassword ? 'text' : 'password'} // #signup
                    placeholder="Enter your password" // #signup
                    value={password} // #signup
                    onChange={(e) => setPassword(e.target.value)} // #signup
                    className="h-11 pr-10 border-slate-200 focus:border-teal-500 focus:ring-teal-500" // #signup
                    required // #signup
                  />
                  <Button // #signup
                    type="button" // #signup
                    variant="ghost" // #signup
                    size="sm" // #signup
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" // #signup
                    onClick={() => setShowPassword(!showPassword)} // #signup
                  >
                    {showPassword ? ( // #signup
                      <EyeOff className="h-4 w-4 text-slate-400" /> // #signup
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" /> // #signup
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2"> {/* #signup */}
                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium"> {/* #signup */}
                  Confirm Password
                </Label>
                <div className="relative"> {/* #signup */}
                  <Input // #signup
                    id="confirmPassword" // #signup
                    type={showConfirmPassword ? 'text' : 'password'} // #signup
                    placeholder="Confirm your password" // #signup
                    value={confirmPassword} // #signup
                    onChange={(e) => setConfirmPassword(e.target.value)} // #signup
                    className="h-11 pr-10 border-slate-200 focus:border-teal-500 focus:ring-teal-500" // #signup
                    required // #signup
                  />
                  <Button // #signup
                    type="button" // #signup
                    variant="ghost" // #signup
                    size="sm" // #signup
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" // #signup
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} // #signup
                  >
                    {showConfirmPassword ? ( // #signup
                      <EyeOff className="h-4 w-4 text-slate-400" /> // #signup
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" /> // #signup
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-2"> {/* #signup */}
                <Checkbox // #signup
                  id="consent" // #signup
                  checked={consent} // #signup
                  onCheckedChange={(checked) => setConsent(checked as boolean)} // #signup
                />
                <Label // #signup
                  htmlFor="consent" // #signup
                  className="text-sm text-slate-600 cursor-pointer leading-relaxed" // #signup
                >
                  I agree to the{' '} {/* #signup */}
                  <Button // #signup
                    variant="link" // #signup
                    className="px-0 text-teal-600 hover:text-teal-700 h-auto" // #signup
                    type="button" // #signup
                  >
                    Terms and Conditions
                  </Button>
                  {' '}and{' '} {/* #signup */}
                  <Button // #signup
                    variant="link" // #signup
                    className="px-0 text-teal-600 hover:text-teal-700 h-auto" // #signup
                    type="button" // #signup
                  >
                    Privacy Policy
                  </Button>
                </Label>
              </div>

              {error && ( // #signup
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md"> {/* #signup */}
                  {error}
                </div>
              )}

              <Button // #signup
                type="submit" // #signup
                className="w-full h-11 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-medium shadow-lg transition-all duration-200" // #signup
                disabled={isLoading} // #signup
              >
                {isLoading ? ( // #signup
                  <div className="flex items-center space-x-2"> {/* #signup */}
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> {/* #signup */}
                    <span>Creating account...</span> {/* #signup */}
                  </div>
                ) : (
                  'Create Account' // #signup
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-slate-500"> {/* #signup */}
              Already have an account?{' '} {/* #signup */}
              <Link // #routing
                to="/" // #routing
                className="text-teal-600 hover:text-teal-700 font-medium" // #routing
              >
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage; // #signup
